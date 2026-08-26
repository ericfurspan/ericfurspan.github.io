# AWS Migration Plan

Created: Unknown
Last updated: 2026-08-26 17:17 ET

## Goal

Move the personal site from GitHub Pages to a small, secure AWS architecture
that provides hands-on practice with services and controls relevant to AWS
architecture and security study.

The migration should improve the site's design and source structure, keep the
browser-native implementation, tightly bound monthly costs, and retain GitHub
Pages as a rollback target until the AWS deployment is fully validated.

First deploy the existing site unchanged, then make a fidelity-preserving vanilla
refactor. Visual exploration and any approved content changes happen afterward.
Keep one page and the existing content scope for both software-engineering and
security/cloud hiring audiences. The dark terminal style remains the fallback.

## Current State

- Static site consisting of `index.html`, local assets, and `robots.txt`.
- Hosted from the `ericfurspan.github.io` repository.
- GitHub Actions runs Python smoke tests on pushes and pull requests.
- No backend, database, authentication, or server-side processing.
- Canonical and Open Graph URLs currently reference GitHub Pages.
- `ericfurspan.com` is registered with Namecheap and will be the production
  domain.
- The domain is currently parked on NSOne. A live DNS check on August 25, 2026
  found no apex, `www`, MX, TXT, or CAA records.
- WHOIS and live DNS reported different NSOne nameserver pools. The complete
  delegation and record set must be checked again immediately before cutover.

Account setup checkpoint, August 26, 2026:

- Root MFA and no root access keys were confirmed in the console screenshots.
- IAM user `eric` has a newly registered passkey and no access keys. It inherits
  `AdministratorAccess` from group `admin`; this is privileged bootstrap access.
- AWS CLI profile `personal-site` was verified through STS as IAM user `eric`.
  Authentication uses browser-based `aws login`, not long-lived access keys.
- The user reports creating the account-wide `Personal AWS Monthly` budget at
  $5. Alert delivery has not yet been verified. There are no active credits shown.
- The payment method was updated and an alternate billing contact was added.
  Operations and security alternate contacts have not been added.
- AWS CLI 2.34.23 and Terraform 1.15.8 are installed. Account recovery details
  have not yet been independently verified.

Bootstrap validation completed August 26: Terraform formatting and configuration
validation passed, all three mocked identity tests passed, and all eight existing
site tests passed. A live read-only Terraform plan authenticated as `eric` and
proposed output values only. AWS provider 6.61.0 is locked locally. At that
checkpoint, no apply or resource creation had been performed.

The first hosting apply created six resources: one private S3 bucket, its
public-access block and CloudFront-only bucket policy, one CloudFront Origin
Access Control, one response headers policy, and one CloudFront distribution.
Post-apply Terraform verification reports no changes. CloudFront is deployed at
`d4x8hvuz4zc5m.cloudfront.net`, and all four S3 public-access controls are enabled.
The unchanged site files were uploaded manually as the initial deployment:
`index.html`, `robots.txt`, and the three files under `assets/`. CloudFront returns
HTTP 200, the served HTML hash matches the local file, the expected security and
`X-Robots-Tag` headers are present, and direct S3 object access returns HTTP 403.
GitHub OIDC, a `main`-only deployment role, and its least-privilege inline policy
have also been created. Terraform reports no drift. The local workflow is ready
but has not been committed or pushed, so automated deployment has not yet run.
No DNS change has been performed.

The GitHub Pages baseline was captured in `docs/baseline/2026-08-26/README.md`.
The live site returned HTTP 200 and matched remote `main` at commit `083a336`.
The desktop capture is intact. The mobile capture has no horizontal scroll area,
but content is visibly clipped at the right edge; preserve that behavior for the
unchanged AWS deployment and address it during the later refactor or redesign.

## Target Architecture

```text
Visitor
  |
  v
Route 53
  |
  v
CloudFront
  |  HTTPS, caching, redirects, security headers
  v
Origin Access Control
  |
  v
Private S3 bucket
  Block Public Access enabled
```

Deployment path:

```text
GitHub Actions
  |
  v
GitHub OIDC provider in AWS
  |
  v
Least-privilege deployment role
  |
  +--> Upload approved site files to S3
  +--> Invalidate required CloudFront paths
```

## Architecture Decisions

1. Use a regular private S3 bucket as the CloudFront origin.
   Do not enable the public S3 website endpoint.
2. Use CloudFront Origin Access Control with signed origin requests.
3. Keep S3 Block Public Access enabled and disable ACL-based access.
4. Use CloudFront for HTTPS enforcement, caching, compression, and headers.
5. Manage the AWS infrastructure with Terraform.
6. Use GitHub Actions OIDC federation instead of stored AWS access keys.
7. Deploy initially to the CloudFront hostname without changing production DNS.
8. Treat custom-domain cutover as a separate, explicitly approved final phase.
9. Use `https://ericfurspan.com` as the canonical URL and serve both the apex and
   `www.ericfurspan.com` through the same CloudFront distribution.
10. Keep the domain registration at Namecheap. Use a Route 53 public hosted zone
    for DNS, with the Namecheap nameserver change reserved for final cutover.
11. Use the existing personal AWS account for this project.
    Do not create another account, an organization, or IAM Identity Center.
12. Deploy automatically from `main` only after the validation job succeeds.
    Pull requests validate but do not deploy.
13. Redesign the site with improved vanilla HTML, CSS, and JavaScript. Separate
    content, presentation, and behavior without adding a framework or build step.

## Security Baseline

- A bucket policy permits object reads only from the specific CloudFront
  distribution through Origin Access Control.
- The deployment role can write only to the site bucket and invalidate only the
  site distribution. It cannot create or modify infrastructure.
- The Terraform execution identity is separate from the deployment role.
- Human console access uses the existing IAM user with MFA. CLI and Terraform
  access use temporary credentials from `aws login --profile personal-site`.
  Do not create long-lived personal IAM access keys or enable Identity Center.
- The root user has no access keys, uses phishing-resistant MFA where available,
  and is reserved for tasks that specifically require root credentials.
- HTTPS is enforced for viewers. The ACM certificate for a custom CloudFront
  domain is created in `us-east-1`.
- CloudFront applies HSTS, content-type protection, framing protection, a
  referrer policy, and an explicit Content Security Policy.
- S3 default encryption remains enabled. SSE-S3 is sufficient because the site
  contains public content. KMS encryption is an optional learning exercise.
- AWS CloudTrail Event history is sufficient for the initial learning deployment.
  A dedicated trail and CloudFront access logging are deferred exercises.
- AWS Budgets provides early cost alerts before optional paid security services
  are enabled. Retain the existing manually created budget; do not create a
  duplicate or import it into Terraform without a separate decision. Budget
  alerts are not a hard spending limit and can lag behind incurred costs.
- WAF, Security Hub, GuardDuty, and AWS Config are optional exercises, not part
  of the initial production baseline. Their value and cost must be reviewed
  before activation.

## Infrastructure Layout

```text
infra/
  main.tf
  variables.tf
  outputs.tf
  terraform.tfvars.example
  tests/identity.tftest.hcl
  tests/hosting.tftest.hcl
  README.md
```

Terraform state should not be committed. Start with local state while only one
person manages the project. A later exercise can move state to a dedicated S3
backend with versioning and state locking.

The current configuration defines only the private S3 and temporary CloudFront
hosting layer. Site uploads, GitHub deployment permissions, DNS, certificates,
dedicated logging, WAF, and remote state are later steps. Local variable files
stay ignored; the provider lock file belongs in Git. Terraform apply and external
changes require explicit approval.

## Migration Phases

### Phase 0: Baseline and account safety

- Verify the personal AWS account's primary email, phone number, account recovery
  path, and billing, security, and operations contacts.
- Give the root user a unique password stored in a password manager.
- Confirm root MFA and the absence of root access keys. A second root MFA method
  is a recommended recovery improvement, not permission to modify credentials.
- Use IAM user `eric` with its passkey for administration, keeping its existing
  permissions unchanged during bootstrap.
- Verify the CLI and Terraform use the `personal-site` login profile and the
  intended account. Do not create a long-lived IAM access key for Terraform.
- Configure AWS Budgets alerts and verify their notification destination.
- Repair the expired payment method before deploying resources.
- Record the target account and region locally without committing sensitive
  account configuration or credentials.
- Record the current GitHub Pages URL and run the existing smoke tests.
- Capture current response headers and a visual baseline for comparison.

Exit condition: the current site is reproducibly validated and account-level
safety controls are in place.

### Phase 1: Deploy the unchanged site to AWS

- Create the private S3 bucket, CloudFront distribution, Origin Access Control,
  bucket policy, and response headers policy with Terraform, only after
  the configuration, costs, and plan have been reviewed and apply is authorized.
- Allow only `GET` and `HEAD` viewer methods.
- Configure `index.html` as the default root object.
- Upload only `index.html`, `robots.txt`, and the public assets, not the repository
  root. Keep content, styles, and interactions unchanged.
- Use the CloudFront hostname for testing; retain the GitHub Pages canonical URL
  until final cutover. Prevent indexing the temporary deployment using a response
  header and remove that restriction during the approved custom-domain launch.
- Inspect existing IAM OIDC providers before adding one. Reuse an existing GitHub
  provider if present; never overwrite shared account configuration blindly.
- Restrict the deploy-role trust policy to this repository's `main` ref and the
  STS audience. Pull requests must not receive deployment credentials.
- Create a least-privilege deployment role.
- Extend GitHub Actions to run tests before deployment.
- Run the deployment job automatically on pushes to `main` after tests pass.
  Pull requests run validation only.
- Use short-cache headers for HTML and unversioned assets. Reserve immutable
  caching for content-hashed filenames.
- Invalidate only paths that require immediate refresh.
- Compare the CloudFront version against GitHub Pages on desktop and mobile.
- Verify HTTPS, security headers, private S3 access, and least-privilege deployment
  before calling the AWS baseline complete.

Exit condition: the unchanged site works through CloudFront, tests gate automatic
deployment, and direct S3 access fails. No custom-domain cutover has occurred.

### Phase 2: Refactor vanilla code with fidelity

- Separate markup, styles, project data, and behavior without a framework or
  build step. Preserve exact content, appearance, and interactions.
- Adapt tests to the new structure without weakening behavioral coverage.
- Compare before/after screenshots at matching desktop and mobile sizes.
- Test keyboard navigation, project details, and the existing terminal behavior.
- Deploy the verified refactor through the established AWS pipeline.

Exit condition: only code organization changes; visual and behavioral parity
checks pass. Do not mix redesign changes into this stage.

### Phase 3: Explore and implement a visual direction

- Explore refinements of the dark terminal identity and a fresh alternative.
- Obtain approval for a selected direction before implementing it.
- Keep the site single-page with the existing content scope. Additional content
  is optional and requires approval, not a migration prerequisite.
- Validate accessibility, responsiveness, performance, metadata, and key links.
- Use the existing style as the fallback if no new direction is selected.

Exit condition: the selected design is approved, or the user elects to retain the
existing style. The working AWS baseline remains available for rollback.

### Phase 4: Custom domain, cutover, and closeout

- Recheck the complete live and registry DNS state for `ericfurspan.com`.
- Create a Route 53 public hosted zone without changing Namecheap nameservers.
- Request an ACM certificate in `us-east-1` for the apex and `www`.
- Publish its validation CNAMEs in the currently authoritative DNS provider and
  copy them into Route 53. An undelegated Route 53 zone cannot validate the
  certificate by itself. If parked DNS cannot be edited, stop and agree on a
  revised delegation sequence before making changes.
- Add both hostnames to CloudFront and test them before changing delegation.
- Create Route 53 alias records for the apex and `www` CloudFront targets.
- Update canonical and Open Graph URLs and remove temporary indexing restrictions
  as part of the approved launch. Keep the original GitHub Pages release intact.
- Change the authoritative nameservers at Namecheap only after the new Route 53
  zone and CloudFront configuration pass validation.
- Keep GitHub Pages intact during the observation period.

- Document the final architecture, IAM boundaries, deployment flow, and costs.
- Record validation evidence and a separately approved failure/recovery exercise.
- Decide whether to retain GitHub Pages as a cold rollback target.
- Review whether one optional security service adds meaningful learning value.

Exit condition: the custom domain works through CloudFront, monitoring is healthy,
rollback is documented, and the project provides evidence of the learning goals.

## Validation Checklist

- Existing Python smoke tests pass before and after deployment.
- `index.html`, assets, and `robots.txt` return successful responses.
- HTTP redirects to HTTPS.
- TLS certificate and hostname validation succeed.
- CloudFront returns the intended response security headers.
- Anonymous S3 object access is denied.
- The S3 bucket policy names only the intended CloudFront distribution.
- GitHub Actions uses temporary OIDC credentials and stores no AWS keys.
- Deployment permissions and Terraform permissions are separate.
- Cache behavior and invalidation are verified after a content change.
- Logs, retention, and budget alerts are verified.
- An unchanged GitHub Pages release and a tested AWS release rollback are
  available before DNS cutover. Review GitHub Pages publishing behavior before
  changing `main` so automatic updates do not erase the fallback.

## Rollback

Before DNS cutover, the original GitHub Pages URL remains the fallback. Record
its release commit and preserve its deployment before changing the site.

After DNS cutover:

1. For a content regression, redeploy the last known-good AWS release and
   invalidate the affected CloudFront paths.
2. For an infrastructure failure, direct users to the preserved GitHub Pages URL
   while investigating. Serving the custom domain from GitHub Pages would need
   its own configuration and TLS validation; it is not an existing fallback.
3. Restore recorded DNS delegation only when intentionally undoing DNS setup.
   The old domain was parked, so restoring old nameservers does not restore a
   functioning website at the custom domain.
4. Preserve AWS resources and logs until the failure is understood.

Do not destroy the AWS stack as the first rollback action.

## Cost Guardrails

- Set budget alerts before provisioning the site stack.
- Tag all resources with project and environment identifiers.
- Avoid WAF, NAT Gateway, containers, databases, and always-on compute.
- Apply log retention and S3 lifecycle rules.
- Review the billing dashboard after initial deployment and after cutover.
- Require an explicit decision before enabling any optional paid service.

## Learning Outcomes

This project should produce practical evidence of:

- S3 resource policies and Block Public Access.
- CloudFront origins, caching, TLS, headers, and Origin Access Control.
- IAM trust policies, least privilege, roles, and temporary credentials.
- GitHub Actions OIDC federation and secure CI/CD.
- Terraform planning, state, drift, and change review.
- DNS, certificate validation, logging, monitoring, and cost controls.
- Failure diagnosis, rollback planning, and documented recovery.

## Non-Goals

- Adding a JavaScript framework, package manager, or build step without a
  demonstrated need.
- Adding a backend, database, login, or contact-form API.
- Introducing Lambda, API Gateway, Cognito, ECS, or EKS without a real need.
- Enabling security services solely to increase the number of AWS products used.
- Removing GitHub Pages before AWS and DNS validation are complete.
- Creating additional AWS accounts, enabling Organizations, or using IAM
  Identity Center for this project.

## Confirmed Decisions

1. Terraform is the infrastructure-as-code tool.
2. `ericfurspan.com` is the production domain.
3. Namecheap remains the registrar.
4. Route 53 will host DNS after final nameserver cutover.
5. The first milestone is an isolated CloudFront deployment. Custom-domain
   cutover occurs only after validation.
6. The existing personal AWS account owns the resources.
7. Successful pushes to `main` deploy automatically. No manual production
   approval is required.
8. The redesign uses improved vanilla HTML, CSS, and JavaScript rather than a
   frontend framework.
9. AWS baseline first, fidelity-preserving refactor second, optional redesign
   third, and custom-domain cutover last.

## Implementation Prerequisites

1. Complete the remaining recovery/contact, payment, and budget-delivery checks.
2. Reauthenticate the existing CLI profile when its temporary session expires.
3. Review and explicitly authorize resource creation before the first apply.
