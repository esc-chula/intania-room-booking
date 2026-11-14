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
   | `API_BASE_URL_PRODUCTION`                                       | The production API URL                                           |
   | `API_BASE_URL_PREVIEW`, `PRODUCTION_DOMAIN`                     | Optional                                                         |
   | `TF_STATE_BUCKET`, `TF_STATE_PREFIX`                            | Same as `backend.hcl`                                            |
   | `GCP_WIF_PROVIDER`, `GCP_TERRAFORM_SA`, `GCP_TERRAFORM_PLAN_SA` | Workload identity federation, as in the API repository           |

5. **GitHub environments** (Settings, Environments). Create `production` and `vercel-infra-apply`, and add required reviewers to both so a person approves each production deploy and each Terraform apply.
6. **Release PR token (recommended).** Pull requests opened with the default `GITHUB_TOKEN` do not start other workflows, so CI would never run on the release pull request. Create a fine-grained personal access token (or a GitHub App token) with contents and pull requests write on this repository and save it as `RELEASE_PLEASE_TOKEN`. Without it the release PR still works, but you must run CI by hand (or push an empty commit to its branch) before merging if CI is a required check.
7. **Branch protection.** Require `check` (CI) and `template` (PR template) on `main`. The `template` job skips release PRs.

The preview and production jobs fail early, or skip with a notice for previews, when the Vercel secret and variables are missing, so merging this before step 4 is safe.

## Secrets and environment variables

`API_BASE_URL` is the only variable the app reads (`src/env.js`). Next.js evaluates `next.config.js` rewrites at build time, so `vercel pull` fetches it before `vercel build`. Terraform owns it: change it in `infra/` and re-apply, not in the Vercel dashboard. Do not put secrets in `NEXT_PUBLIC_*` variables.

Previews should not use the production API. If `API_BASE_URL_PREVIEW` is unset, previews build against the `localhost` default and cannot reach an API.

## Rollback

Run **Deploy production** from the Actions tab and enter an older tag. It rebuilds that tag, so it needs the same Vercel settings as the original deploy.
