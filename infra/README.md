# Terraform hosting baseline

This configuration defines the minimum AWS hosting layer for the unchanged site:
a private S3 bucket, CloudFront Origin Access Control, a CloudFront distribution,
the bucket policy that permits only that distribution to read site objects, and
a GitHub OIDC deployment role.

## Files

- `main.tf`: Terraform and provider settings, the identity safety check, the
  private S3 and CloudFront resources, and GitHub deployment identity.
- `variables.tf` and `terraform.tfvars.example`: inputs and a safe example.
- `outputs.tf`: the verified operator, region, bucket, temporary CloudFront
  hostname, and GitHub deployment role.
- `tests/`: mocked identity and hosting checks, with no live AWS calls.
- `.terraform.lock.hcl`: the exact AWS provider version and checksums. It belongs
  in Git.

## Local access

The existing IAM user has MFA and administrator permissions for infrastructure
administration. This is privileged access, not least privilege. GitHub deployment
uses a separate scoped OIDC role. Identity Center and Organizations are not used.

Authenticate in your browser as IAM user `eric`, never root:

```sh
aws login --profile personal-site --region us-east-2
```

Local account settings are in the ignored `terraform.tfvars`. On another machine,
copy the example and replace its placeholder account ID. Never add credentials
to Terraform files or commit state, plan files, caches, or local variable files.

## Validation

From the repository root:

```sh
terraform -chdir=infra init -backend=false
terraform -chdir=infra fmt -check -recursive
terraform -chdir=infra validate
terraform -chdir=infra test
terraform -chdir=infra plan -input=false -lock=false
```

`init` downloads provider software locally. `validate` checks configuration,
and `test` uses a mocked provider. The final `plan` reads AWS identity and shows
the exact resources Terraform would create. It does not create them. Review the
plan before any `apply`.

Keep Terraform state local initially, excluded from Git and backed up securely
before future infrastructure changes. Never delete it while managed resources
exist. A remote state backend is a later decision, not a bootstrap prerequisite.

## Automatic deployment

After tests pass on a push to `main`, GitHub Actions requests temporary AWS
credentials through OIDC. The role can manage objects only in the site bucket
and create invalidations only for the site distribution. No AWS access key is
stored in GitHub.

## Deliberately deferred

This step does not configure a custom domain, Route 53, ACM, WAF, CloudFront
logging, or remote Terraform state. No DNS changes are authorized.

## Next gate

Commit and push the workflow, then verify the first OIDC-authenticated deployment.

References: [AWS browser login](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html),
[AWS provider configuration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs),
[Terraform validation](https://developer.hashicorp.com/terraform/cli/commands/validate).
