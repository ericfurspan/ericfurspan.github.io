mock_provider "aws" {}

variables {
  aws_account_id = "123456789012"
}

run "minimal_private_site" {
  command = plan

  override_data {
    target = data.aws_caller_identity.operator
    values = {
      account_id = "123456789012"
      arn        = "arn:aws:iam::123456789012:user/eric"
      user_id    = "test-user"
    }
  }

  assert {
    condition     = aws_s3_bucket.site.bucket == "ericfurspan-site-123456789012"
    error_message = "The site bucket name must be predictable and account-specific."
  }

  assert {
    condition = (
      aws_s3_bucket_public_access_block.site.block_public_acls &&
      aws_s3_bucket_public_access_block.site.block_public_policy &&
      aws_s3_bucket_public_access_block.site.ignore_public_acls &&
      aws_s3_bucket_public_access_block.site.restrict_public_buckets
    )
    error_message = "Every S3 public-access block must remain enabled."
  }

  assert {
    condition     = aws_cloudfront_origin_access_control.site.signing_behavior == "always"
    error_message = "CloudFront must always sign requests to the private S3 origin."
  }

  assert {
    condition     = aws_cloudfront_distribution.site.default_root_object == "index.html"
    error_message = "CloudFront must serve index.html at the distribution root."
  }

  assert {
    condition     = aws_cloudfront_distribution.site.default_cache_behavior[0].viewer_protocol_policy == "redirect-to-https"
    error_message = "CloudFront must redirect HTTP requests to HTTPS."
  }

  assert {
    condition     = one(aws_cloudfront_response_headers_policy.temporary_site.custom_headers_config[0].items).value == "noindex, nofollow"
    error_message = "The temporary CloudFront hostname must not be indexed."
  }

  assert {
    condition     = aws_iam_openid_connect_provider.github.url == "https://token.actions.githubusercontent.com"
    error_message = "The deployment identity provider must use GitHub's OIDC endpoint."
  }

  assert {
    condition     = contains(aws_iam_openid_connect_provider.github.client_id_list, "sts.amazonaws.com")
    error_message = "The GitHub OIDC provider must use the AWS STS audience."
  }

  assert {
    condition     = aws_iam_role.github_deploy.name == "personal-site-github-deploy"
    error_message = "The GitHub deployment role must keep its expected name."
  }
}
