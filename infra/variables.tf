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
  description = "Origin of the Go booking API for production, such as https://api.example.org. The browser calls it directly, so it must be the same origin as the API's GOOGLE_REDIRECT_URL. Set as NEXT_PUBLIC_API_BASE_URL, which is built into the app, so a change needs a new deployment."
  type        = string

  validation {
    condition     = can(regex("^https://", var.api_base_url_production))
    error_message = "The production API must be served over https."
  }

  # The web app appends paths such as /api/v1/... to this value, so a trailing
  # slash or space turns every request into a broken URL.
  validation {
    condition     = can(regex("^https://\\S+[^/\\s]$", var.api_base_url_production))
    error_message = "Remove spaces and the trailing slash from the API URL: https://host, not \"https://host/ \"."
  }
}

variable "api_base_url_preview" {
  description = "API origin for preview deployments. Leave null to set nothing, so previews build against the localhost default in src/env.js. The API's CORS only allows its FRONTEND_URL origin, so a preview cannot sign in even with this set. Do not point previews at the production API."
  type        = string
  default     = null
}

variable "production_domain" {
  description = "Custom domain for production, such as booking.example.com. Leave null to use the *.vercel.app URL."
  type        = string
  default     = null
}
