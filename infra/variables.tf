variable "team_id" {
  description = "Vercel team ID or slug that owns the project. Leave null for a personal account."
  type        = string
  default     = null
}

variable "project_name" {
  description = "Name of the Vercel project."
  type        = string
  default     = "intania-room-booking"
}

variable "api_base_url_production" {
  description = "Base URL of the Go booking API for production. Read at build time, because next.config.js rewrites /api/v1 and /auth/google to it."
  type        = string

  validation {
    condition     = can(regex("^https://", var.api_base_url_production))
    error_message = "The production API must be served over https."
  }

  # The web app appends paths such as /api/v1/... to this value, so a trailing
  # slash or space turns every rewrite into a broken URL.
  validation {
    condition     = can(regex("^https://\\S+[^/\\s]$", var.api_base_url_production))
    error_message = "Remove spaces and the trailing slash from the API URL: https://host, not \"https://host/ \"."
  }
}

variable "api_base_url_preview" {
  description = "Base URL of the API for preview deployments. Leave null to set nothing, so previews build against the localhost default in src/env.js. Do not point previews at the production API."
  type        = string
  default     = null
}

variable "production_domain" {
  description = "Custom domain for production, such as booking.example.com. Leave null to use the *.vercel.app URL."
  type        = string
  default     = null
}
