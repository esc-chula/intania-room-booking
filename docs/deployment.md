# Deployment

The web app runs on Vercel. Terraform (`infra/`) creates the Vercel project and its settings. GitHub Actions builds and deploys, so the Vercel project is not linked to the Git repository.

| What               | File                              | Runs when                                                                 |
| ------------------ | --------------------------------- | ------------------------------------------------------------------------- |
| Checks             | `.github/workflows/ci.yml`        | Every pull request and push to `main`                                     |
| Preview deploy     | `.github/workflows/preview.yml`   | Pull requests from this repository; comments the URL                      |
| Release PR and tag | `.github/workflows/release.yml`   | Push to `main`                                                            |
| Production deploy  | `.github/workflows/deploy.yml`    | A release is created, or by hand with a tag (use an old one to roll back) |
| Infrastructure     | `.github/workflows/terraform.yml` | Format and validate on pull requests; plan and apply by hand              |

## How a release works

1. Merge pull requests into `main` with [Conventional Commit](https://www.conventionalcommits.org) titles (`feat:`, `fix:`, ...).
2. release-please opens a pull request that bumps `package.json` and writes `CHANGELOG.md`. Before 1.0, `feat:` bumps the minor version and a breaking change also bumps the minor version. `fix:` bumps the patch version.
3. Merge that pull request. release-please tags `vX.Y.Z` and creates the GitHub release, and `deploy.yml` deploys the tag to production.

To release as a specific version, put `Release-As: 1.0.0` in the footer of a commit on `main`.

## One-time setup

Do this with the Vercel account and GitHub organisation that will own the deployment.

1. **Vercel token.** Create one at vercel.com/account/tokens. Save it as the `VERCEL_TOKEN` repository secret.
2. **Terraform state.** The stack uses a GCS backend like `intania-room-booking-api/infra`. Create or choose a bucket, then copy `infra/backend.hcl.example` to `infra/backend.hcl` (gitignored). See [open question 27](open-questions.md).
3. **First apply, from your machine** (the pipeline needs the project to exist first):

   ```sh
   cd infra
   cp terraform.tfvars.example terraform.tfvars   # fill in
   export VERCEL_API_TOKEN=...                    # the token from step 1
   terraform init -backend-config=backend.hcl
   terraform apply
   ```

4. **GitHub repository variables** (Settings, Secrets and variables, Actions):

   | Variable                                                        | Value                                                            |
   | --------------------------------------------------------------- | ---------------------------------------------------------------- |
   | `VERCEL_PROJECT_ID`                                             | `terraform output -raw project_id`                               |
   | `VERCEL_ORG_ID`                                                 | The team ID (personal accounts: the account ID in the dashboard) |
   | `API_BASE_URL_PRODUCTION`                                       | The API's origin, the same as its `GOOGLE_REDIRECT_URL` origin   |
   | `API_BASE_URL_PREVIEW`, `PRODUCTION_DOMAIN`, `API_PROXY_TARGET` | Optional. `API_PROXY_TARGET` turns on proxy mode (see below)     |
   | `TF_STATE_BUCKET`, `TF_STATE_PREFIX`                            | Same as `backend.hcl`                                            |
   | `GCP_WIF_PROVIDER`, `GCP_TERRAFORM_SA`, `GCP_TERRAFORM_PLAN_SA` | Workload identity federation, as in the API repository           |

5. **GitHub environments** (Settings, Environments). Create `production` and `vercel-infra-apply`, and add required reviewers to both so a person approves each production deploy and each Terraform apply.
6. **Release PR token (recommended).** Pull requests opened with the default `GITHUB_TOKEN` do not start other workflows, so CI would never run on the release pull request. Create a fine-grained personal access token (or a GitHub App token) with contents and pull requests write on this repository and save it as `RELEASE_PLEASE_TOKEN`. Without it the release PR still works, but you must run CI by hand (or push an empty commit to its branch) before merging if CI is a required check.
7. **Branch protection.** Require `check` (CI) and `template` (PR template) on `main`. The `template` job skips release PRs.

The preview and production jobs fail early, or skip with a notice for previews, when the Vercel secret and variables are missing, so merging this before step 4 is safe.

## Secrets and environment variables

`NEXT_PUBLIC_API_BASE_URL` is the main variable the app reads (`src/env.js`); `API_PROXY_TARGET` is the optional second one (proxy mode, below). It is the Go API's origin, and the browser calls the API there directly, so it is built into the app: `vercel pull` fetches it before `vercel build`, and a change needs a new deployment. Terraform owns it (from the `API_BASE_URL_PRODUCTION` and `API_BASE_URL_PREVIEW` variables): change it in `infra/` and re-apply, not in the Vercel dashboard. If it is missing, the app builds against `http://localhost:8080` and nothing can sign in. Do not put secrets in `NEXT_PUBLIC_*` variables.

Sign-in only works when these agree (see [ADR 0002](adr/0002-auth.md)):

| Setting                    | Where | Value                                                       |
| -------------------------- | ----- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | web   | The API's origin                                            |
| `GOOGLE_REDIRECT_URL`      | API   | `<API origin>/auth/google/callback`, also in Google Console |
| `FRONTEND_URL`             | API   | This site's origin. It is the only origin CORS allows       |

Previews have their own origin, so the API's CORS rejects them and they cannot sign in. If `API_BASE_URL_PREVIEW` is unset, previews build against the `localhost` default and cannot reach an API.

If this site and the API are on different sites (for example `*.vercel.app` and `*.run.app`), the API's cookie is a third-party cookie, and Safari and some other browsers block it. Without a shared domain, use proxy mode: set the Terraform variable `api_proxy_target` (the `API_PROXY_TARGET` repository variable) to the API's origin, set `API_BASE_URL_PRODUCTION` to this site's own origin, change the API's `GOOGLE_REDIRECT_URL` to `<this site>/auth/google/callback` (and register it in Google Cloud Console), then apply Terraform and redeploy. See [ADR 0002](adr/0002-auth.md#proxy-mode-no-shared-domain) and open question 30.

## Rollback

Run **Deploy production** from the Actions tab and enter an older tag. It rebuilds that tag, so it needs the same Vercel settings as the original deploy.
