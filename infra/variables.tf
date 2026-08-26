variable "aws_account_id" {
  description = "Existing personal AWS account ID. Set only in the ignored local terraform.tfvars file."
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "aws_account_id must be a 12-digit AWS account ID."
  }
}

variable "aws_profile" {
  description = "Local AWS CLI profile authenticated with aws login. Never use a root session."
  type        = string
  default     = "personal-site"
  nullable    = false
}

variable "aws_region" {
  description = "Primary resource region. A later CloudFront ACM certificate will use us-east-1 separately."
  type        = string
  default     = "us-east-2"
  nullable    = false
}
