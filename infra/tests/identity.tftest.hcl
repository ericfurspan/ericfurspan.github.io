mock_provider "aws" {}

variables {
  aws_account_id = "123456789012"
}

run "accept_existing_iam_user" {
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
    condition     = output.operator_arn == "arn:aws:iam::123456789012:user/eric"
    error_message = "The expected IAM user must pass the identity check."
  }
}

run "reject_root" {
  command = plan

  override_data {
    target = data.aws_caller_identity.operator
    values = {
      account_id = "123456789012"
      arn        = "arn:aws:iam::123456789012:root"
      user_id    = "123456789012"
    }
  }

  expect_failures = [data.aws_caller_identity.operator]
}

run "reject_other_identity" {
  command = plan

  override_data {
    target = data.aws_caller_identity.operator
    values = {
      account_id = "123456789012"
      arn        = "arn:aws:iam::123456789012:user/someone-else"
      user_id    = "other-user"
    }
  }

  expect_failures = [data.aws_caller_identity.operator]
}
