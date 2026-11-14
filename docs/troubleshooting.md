# Troubleshooting

Start here when something fails on the deployed site. It says what each error means, which side raised it, and where to read the log.

Two services take part, and each has its own logs:

| Service            | What it does                                | Where to read its logs                         |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| This web app       | Pages, `/api/v1/trpc`, rewrites             | Vercel project, Logs                           |
| `room-booking-api` | Google sign-in, `/api/v1/*`, sheet bookings | Google Cloud Run service, Logs (Logs Explorer) |

To check either one by hand, use `curl`. Calling the site shows what a browser gets, and calling the API's own URL takes the web app out of the picture.

## How a request travels

```
browser
  ├─ /auth/google/*, /api/v1/auth/*   ──(rewrite)──▶  Go API
  └─ /api/v1/trpc/*                   ──(rewrite)──▶  this app's tRPC route ──▶ Go API
                                                       adds Cookie: room_auth=… and X-Request-Id
```

The API's sign-in cookie has `Path=/api/v1`, so the browser only sends it to `/api/v1/...` URLs. That is why tRPC is served under `/api/v1/trpc` (see [ADR 0002](adr/0002-auth.md)).

## Match a failure to its log lines: the request id

Every tRPC call has a request id. It is the browser's `x-request-id` if it sent a well-formed one, otherwise a fresh UUID.

- The failed response carries it as `error.json.data.requestId`.
- This app logs one JSON line per failed procedure, in every environment, with `"event":"trpc_error"`, the `path`, the `code`, the `requestId` and, when the Go API answered, `upstreamStatus`, `upstreamTarget` and `upstreamBody`. It never logs the cookie.
- The same id is sent to the API as `X-Request-Id`, and the API logs it as `request_id`.

So: copy the `requestId`, search the Vercel logs for it, then search the Cloud Run logs for the same value.

The id only follows calls this app makes for the person (the sheet endpoints). Calls the browser makes straight through the rewrite, such as `/api/v1/auth/me`, get an id from the API alone.

## Sign-in errors (`/login?auth_error=...`)

The login box shows the Thai message and the code (`รหัสข้อผิดพลาด`). The API raises every code in `redirectError` in `internal/adapter/primary/http/auth/google.go` (repository `intania-room-booking-api`), and logs `Google sign-in callback failed` with a `stage` that says exactly which check failed. The messages are in `src/features/auth/lib/errors.ts`.

| Code                  | Stage in the API log                        | Usual cause and first check                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_callback`    | `state_cookie`                              | The browser did not send the `google_oauth_state` cookie to the callback. The cookie is set on the host where `/auth/google/login` was opened, and Google returns the browser to `GOOGLE_REDIRECT_URL`. If those are different hosts the cookie never arrives. Check that `GOOGLE_REDIRECT_URL` is `https://<site>/auth/google/callback`. |
| `invalid_callback`    | `state_expired_or_used`                     | The sign-in took longer than 10 minutes, the callback address was opened twice (reload, back button), or the state row is gone from the database.                                                                                                                                                                                         |
| `invalid_callback`    | `missing_code`                              | Google called back without a `code`.                                                                                                                                                                                                                                                                                                      |
| `invalid_callback`    | `code_exchange`                             | The API could not swap the code for tokens: wrong `GOOGLE_CLIENT_SECRET`, a redirect URI that does not exactly match the one registered in Google Cloud Console, or a reused code.                                                                                                                                                        |
| `invalid_callback`    | `missing_id_token`, `id_token_verification` | Google answered without a usable ID token, or its issuer, audience (`GOOGLE_CLIENT_ID`) or expiry did not check out.                                                                                                                                                                                                                      |
| `access_denied`       | `google_denied`                             | The person cancelled on the Google screen.                                                                                                                                                                                                                                                                                                |
| `ineligible`          | `eligibility`                               | Not a verified `@student.chula.ac.th` address whose local part ends in `21`.                                                                                                                                                                                                                                                              |
| `account_unavailable` | `account_unavailable`                       | The account is disabled or deleted. ฝ่าย OS has to re-enable it.                                                                                                                                                                                                                                                                          |
| `identity_conflict`   | `identity_conflict`                         | The Google account does not match the stored user.                                                                                                                                                                                                                                                                                        |
| `server_error`        | `state_storage`, `user_resolution`          | The API could not reach PostgreSQL, or failed while finding or creating the user. Check `/ready` on the API.                                                                                                                                                                                                                              |

Any code not in this table still shows its code in the box. Add it to `errors.ts` and to this table.

Checking `invalid_callback` without a browser: run `curl -si https://<site>/auth/google/login` and read two headers. `location` goes to `accounts.google.com`, and its `redirect_uri` must be on `<site>`. `set-cookie` sets `google_oauth_state`. A `redirect_uri` on another host is the `state_cookie` failure. `curl -si 'https://<site>/auth/google/callback?state=x&code=x'` should answer 302 to `<site>/login?auth_error=invalid_callback`.

## Data errors (tRPC)

A failed `availability.*` call returns one of these. The screen shows "โหลดข้อมูลไม่สำเร็จ", and the code and message are in the response and in the log line.

| `code`              | `message`                                     | Meaning                                                                                                                                             |
| ------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNAUTHORIZED`      | `Not signed in`                               | The request reached this app with no `room_auth` cookie. The browser calls `/api/trpc` instead of `/api/v1/trpc`, or the cookie expired (one hour). |
| `UNAUTHORIZED`      | `Booking API returned 401`                    | The cookie was sent and the API rejected it: expired, or signed with a different `JWT_SECRET`.                                                      |
| `BAD_REQUEST`       | `Booking API returned 400`                    | The API refused the query, such as an unknown building. `upstreamBody` says which.                                                                  |
| `TOO_MANY_REQUESTS` | `Booking API returned 429`                    | More than 600 sheet requests a minute for this user.                                                                                                |
| `BAD_GATEWAY`       | `Cannot reach the booking API`                | Network failure from this app to the API. Check `API_BASE_URL` and that the API is up.                                                              |
| `BAD_GATEWAY`       | `Booking API returned 5xx`                    | The API or Google Sheets failed. `upstreamBody` has the API's reason. Look for the same `requestId` in Cloud Run.                                   |
| `BAD_GATEWAY`       | `Booking API returned an unexpected response` | The API's response shape changed. Compare with `src/server/api/sheet-bookings.ts` and the API's `swagger.yaml`.                                     |

## "ไม่สามารถตรวจสอบการเข้าสู่ระบบได้"

Shown by `AuthGate` when `/api/v1/auth/me` could not answer (not when the answer is "signed out"). The line `รายละเอียด:` under it is the cause:

- `Cannot reach the API`: the browser could not reach `/api/v1/auth/me`. Open the browser's Network tab. The console also has the original error.
- `Auth API returned 503`: the API runs without sign-in switched on (no `DATABASE_URL`, `JWT_SECRET`, or Google client settings).
- `Unexpected response`: the answer was not the user shape in `src/features/auth/lib/session.ts`.

## "เกิดข้อผิดพลาดในการแสดงหน้านี้" and "ระบบขัดข้อง"

A page threw while rendering (`src/app/error.tsx`), or the root layout did (`src/app/global-error.tsx`). The `รหัสอ้างอิง` on the screen is the Next.js `digest`. Search the Vercel logs for it to find the server-side stack trace. It is missing when the failure happened only in the browser, so look in the browser console (`Page failed to render`).

## Configuration that causes most outages

| Setting                 | Where                    | Must be                                                                                             |
| ----------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| `GOOGLE_REDIRECT_URL`   | API, GitHub variable     | `https://<site>/auth/google/callback`, the web app's origin, and registered in Google Cloud Console |
| `FRONTEND_URL`          | API, GitHub variable     | The web app's origin (`https://<site>`), because sign-in errors and success redirect there          |
| `API_BASE_URL`          | Vercel, set by Terraform | The API's `https://` origin. Spaces and trailing slashes are removed, and Terraform rejects them    |
| `AUTH_COOKIE_SAME_SITE` | API                      | `lax` when the site and API share the browser's origin through the rewrite                          |
| `/health`, `/ready`     | API only                 | The web app does not proxy them. Call the API's own URL                                             |

The Vercel site does not read these API settings. Changing `API_BASE_URL` needs a new deployment, because the rewrites are built into it.
