# GitHub Actions passes unset variables as empty strings, so treat "" like null.
locals {
  team_id     = var.team_id == "" ? null : var.team_id
  has_preview = var.api_base_url_preview != null && var.api_base_url_preview != ""
  has_domain  = var.production_domain != null && var.production_domain != ""
}

# Deployments come from GitHub Actions (.github/workflows/deploy.yml and
# preview.yml) using the Vercel CLI, so the project is deliberately not linked
# to the Git repository. Linking it would make Vercel build every push a second time.
resource "vercel_project" "web" {
  name    = var.project_name
  team_id = local.team_id

  framework       = "nextjs"
  install_command = "bun install --frozen-lockfile"
  build_command   = "bun run build"
  node_version    = "24.x" # matches .nvmrc
}

resource "vercel_project_environment_variable" "api_base_url_production" {
  project_id = vercel_project.web.id
  team_id    = local.team_id
  key        = "API_BASE_URL"
  value      = var.api_base_url_production
  target     = ["production"]
  sensitive  = false
}

resource "vercel_project_environment_variable" "api_base_url_preview" {
  count = local.has_preview ? 1 : 0

  project_id = vercel_project.web.id
  team_id    = local.team_id
  key        = "API_BASE_URL"
  value      = var.api_base_url_preview
  target     = ["preview"]
  sensitive  = false
}

resource "vercel_project_domain" "production" {
  count = local.has_domain ? 1 : 0

  project_id = vercel_project.web.id
  team_id    = local.team_id
  domain     = var.production_domain
}
