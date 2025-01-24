terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_cognito_user_pool" "test_cognito_user_pool" {
    name = "test_cognito_user_pool"

    password_policy {
        minimum_length    = 8
        require_lowercase = false
        require_numbers   = false
        require_symbols   = false
        require_uppercase = false
    }

    auto_verified_attributes = [ "email" ]
    verification_message_template {
        default_email_option = "CONFIRM_WITH_LINK"
    }
}

resource "aws_cognito_user_pool_client" "test_cognito_user_pool_client" {
    name = "test_cognito_user_pool_client"
    user_pool_id = aws_cognito_user_pool.test_cognito_user_pool.id
    explicit_auth_flows = [ "ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH" ]
}
resource "aws_cognito_user_pool_domain" "test_cognito_user_pool_domain" {
    domain = "test-test-test-user-pool-domain"
    user_pool_id = aws_cognito_user_pool.test_cognito_user_pool.id
}

output "COGNITO_CLIENT_ID" {
    value = aws_cognito_user_pool_client.test_cognito_user_pool_client.id
}