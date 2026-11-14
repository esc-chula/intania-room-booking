output "project_id" {
  description = "Set as the VERCEL_PROJECT_ID variable in GitHub."
  value       = vercel_project.web.id
}

output "team_id" {
  description = "Set as the VERCEL_ORG_ID variable in GitHub (for a personal account, use the account ID from the Vercel dashboard)."
  value       = local.team_id
}

output "production_url" {
  description = "Where production is served."
  value       = local.has_domain ? "https://${var.production_domain}" : "https://${var.project_name}.vercel.app"
}
