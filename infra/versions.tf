terraform {
  required_version = ">= 1.5.0, < 2.0.0"
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 5.26"
    }
  }
  # Partial configuration: pass the bucket and prefix at `terraform init`
  # (see backend.hcl.example). Same layout as intania-room-booking-api/infra.
  backend "gcs" {}
}

# The token comes from the VERCEL_API_TOKEN environment variable.
provider "vercel" {}
