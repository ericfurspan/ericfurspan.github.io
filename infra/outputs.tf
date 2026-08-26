output "operator_arn" {
  description = "Verified IAM identity used by Terraform. This is an identifier, not a credential."
  value       = data.aws_caller_identity.operator.arn
}

output "aws_region" {
  description = "Primary AWS region for this project."
  value       = var.aws_region
}

output "site_bucket_name" {
  description = "Private S3 bucket that will hold the site files."
  value       = aws_s3_bucket.site.id
}

output "cloudfront_domain_name" {
  description = "Temporary CloudFront hostname used before custom-domain cutover."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "github_deploy_role_arn" {
  description = "Least-privilege role assumed by GitHub Actions through OIDC."
  value       = aws_iam_role.github_deploy.arn
}
