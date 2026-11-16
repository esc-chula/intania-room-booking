# Troubleshooting

Start here when something fails on the deployed site. It says what each error means, which side raised it, and where to read the log.

Two services take part, and each has its own logs:

| Service            | What it does                                | Where to read its logs                         |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| This web app       | Pages and its own `/api/trpc`               | Vercel project, Logs                           |
| `room-booking-api` | Google sign-in, `/api/v1/*`, sheet bookings | Google Cloud Run service, Logs (Logs Explorer) |

To check the API by hand, use `curl` on its own URL. Calls the browser makes to the API appear in the browser's Network tab and Console, not in Vercel's logs.

## How a request travels

```
browser ──▶ Go API   (login, /api/v1/auth/*, /api/v1/admin/sheet-bookings/*)
   │          sign-in cookies belong to the API's host; CORS allows only FRONTEND_URL
   └──────▶ this app  (pages, /api/trpc)
```

This app does not sit in front of the API. The browser calls it at `NEXT_PUBLIC_API_BASE_URL` with the cookie ([ADR 0002](adr/0002-auth.md)). So an auth or booking failure is read in the browser console and in the API's logs.

## Sign-in errors (`/login?auth_error=...`)

The login box shows the Thai message and the code (`รหัสข้อผิดพลาด`). The API raises every code in `redirectError` in `internal/adapter/primary/http/auth/google.go` (repository `intania-room-booking-api`), and logs `Google sign-in callback failed` with a `stage` that says exactly which check failed. The messages are in `src/features/auth/lib/errors.ts`.

| Code                  | Stage in the API log                        | Usual cause and first check                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `invalid_callback`    | `state_cookie`                              | The browser did not send the `google_oauth_state` cookie to the callback. That cookie is set on the host where `/auth/google/login` was opened, and Google returns the browser to `GOOGLE_REDIRECT_URL`. They must be the same host: the login button must go to the API, not through this site. |
| `invalid_callback`    | `state_expired_or_used`                     | The sign-in took longer than 10 minutes, the callback address was opened twice (reload, back button), or the state row is gone from the database.                                                                                                                                                |
| `invalid_callback`    | `missing_code`                              | Google called back without a `code`.                                                                                                                                                                                                                                                             |
| `invalid_callback`    | `code_exchange`                             | The API could not swap the code for tokens: wrong `GOOGLE_CLIENT_SECRET`, a redirect URI that does not exactly match the one registered in Google Cloud Console, or a reused code.                                                                                                               |
| `invalid_callback`    | `missing_id_token`, `id_token_verification` | Google answered without a usable ID token, or its issuer, audience (`GOOGLE_CLIENT_ID`) or expiry did not check out.                                                                                                                                                                             |
| `access_denied`       | `google_denied`                             | The person cancelled on the Google screen.                                                                                                                                                                                                                                                       |
| `ineligible`          | `eligibility`                               | Not a verified `@student.chula.ac.th` address whose local part ends in `21`.                                                                                                                                                                                                                     |
| `account_unavailable` | `account_unavailable`                       | The account is disabled or deleted. ฝ่าย OS has to re-enable it.                                                                                                                                                                                                                                 |
| `identity_conflict`   | `identity_conflict`                         | The Google account does not match the stored user.                                                                                                                                                                                                                                               |
| `server_error`        | `state_storage`, `user_resolution`          | The API could not reach PostgreSQL, or failed while finding or creating the user. Check `/ready` on the API.                                                                                                                                                                                     |

Any code not in this table still shows its code in the box. Add it to `errors.ts` and to this table.

Checking `invalid_callback` without a browser: run `curl -si <API>/auth/google/login`. `location` goes to `accounts.google.com`, and its `redirect_uri` must be on the same host you called. `set-cookie` sets `google_oauth_state`. Then `curl -si '<API>/auth/google/callback?state=x&code=x'` should answer 302 to `<FRONTEND_URL>/login?auth_error=invalid_callback`, which also shows what `FRONTEND_URL` is.

## Signed in, then sent straight back to the login page

Sign-in finished, but `GET <API>/api/v1/auth/me` answers 401 in the Network tab, so the browser did not send `room_auth`. Check, in this order:

1. `NEXT_PUBLIC_API_BASE_URL` is the same origin as the API's `GOOGLE_REDIRECT_URL`. The cookie belongs to that host, so another host (such as the API's second Cloud Run hostname) never receives it.
2. Third-party cookies. If this site and the API are on different sites (`*.vercel.app` and `*.run.app`), the cookie is a third-party cookie, and Safari and some other browsers block it. Try Chrome, and see open question 30.
3. The cookie lasts one hour (`room_auth`).

## Data errors (availability)

A failed load shows "โหลดข้อมูลไม่สำเร็จ" (or "เซสชันหมดอายุ" for a 401) with the cause on a `รายละเอียด:` line. The browser Console has `Availability request failed (…)` with the full error.

| `รายละเอียด:`                                 | Meaning                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Cannot reach the booking API`                | The browser could not complete the call: offline, the API is down, or CORS blocked it. The Network tab shows which. For CORS, check that the API's `FRONTEND_URL` is exactly this site's origin. |
| `Booking API returned 401`                    | The cookie was not sent or was rejected: see "Signed in, then sent straight back", or the cookie expired or was signed with a different `JWT_SECRET`.                                            |
| `Booking API returned 400`                    | The API refused the query, such as an unknown building. The response body says which.                                                                                                            |
| `Booking API returned 429`                    | More than 600 sheet requests a minute for this user.                                                                                                                                             |
| `Booking API returned 5xx`                    | The API or Google Sheets failed. Look in the Cloud Run logs around that time.                                                                                                                    |
| `Booking API returned an unexpected response` | The API's response shape changed. Compare with `src/features/availability/lib/sheet-api.ts` and the API's `swagger.yaml`.                                                                        |

## "ไม่สามารถตรวจสอบการเข้าสู่ระบบได้"

Shown by `AuthGate` when `/api/v1/auth/me` could not answer (not when the answer is "signed out"). The line `รายละเอียด:` under it is the cause:

- `Cannot reach the API`: the browser could not complete the call. Open the Network tab and the Console. A CORS error means the API's `FRONTEND_URL` is not this site's origin.
- `Auth API returned 503`: the API runs without sign-in switched on (no `DATABASE_URL`, `JWT_SECRET`, or Google client settings).
- `Unexpected response`: the answer was not the user shape in `src/features/auth/lib/session.ts`.

## "เกิดข้อผิดพลาดในการแสดงหน้านี้" and "ระบบขัดข้อง"

A page threw while rendering (`src/app/error.tsx`), or the root layout did (`src/app/global-error.tsx`). The `รหัสอ้างอิง` on the screen is the Next.js `digest`. Search the Vercel logs for it to find the server-side stack trace. It is missing when the failure happened only in the browser, so look in the browser console (`Page failed to render`).

A failed `/api/trpc` call is logged in Vercel as one JSON line with `"event":"trpc_error"`, the `path`, the `code` and a `requestId`. The same `requestId` is in the failed response (`error.json.data.requestId`).

## Configuration that causes most outages

| Setting                    | Where                    | Must be                                                                                            |
| -------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `GOOGLE_REDIRECT_URL`      | API, GitHub variable     | `<API origin>/auth/google/callback`, registered in Google Cloud Console                            |
| `NEXT_PUBLIC_API_BASE_URL` | Vercel, set by Terraform | The same `<API origin>`. Spaces and trailing slashes are removed, and Terraform rejects them       |
| `FRONTEND_URL`             | API, GitHub variable     | This site's origin (`https://<site>`). The login redirects there, and CORS allows only this origin |
| `AUTH_COOKIE_SAME_SITE`    | API                      | `none` when this site and the API are on different sites (the production default)                  |
| `/health`, `/ready`        | API only                 | This site does not serve them. Call the API's own URL                                              |

`NEXT_PUBLIC_API_BASE_URL` is built into the app, so changing it needs a new deployment. Vercel preview deployments have other origins, so the API's CORS rejects them: they cannot sign in.
