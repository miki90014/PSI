resource "aws_cognito_user_pool" "cinema_user_pool" {
  name = "cinema_user_pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }

  auto_verified_attributes = ["email"]
  verification_message_template {
    default_email_option = "CONFIRM_WITH_LINK"
  }
}

resource "aws_cognito_user_pool_client" "cinema_user_pool_client" {
  name                = "cinema_user_pool_client"
  user_pool_id        = aws_cognito_user_pool.cinema_user_pool.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

resource "aws_cognito_user_pool_domain" "cinema_user_pool_domain" {
  domain       = "cinema-user-pool-domain"
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
}

resource "aws_cognito_user_group" "network_admin_group" {
  name         = "network-admin"
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  description  = "Group for network administrators"
}

resource "aws_cognito_user_group" "cinema_admin_group" {
  name         = "cinema-admin"
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  description  = "Group for cinema administrators"
}

resource "aws_cognito_user_group" "employee_group" {
  name         = "employee"
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  description  = "Group for employees"
}

resource "aws_cognito_user_group" "customer_group" {
  name         = "customer"
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  description  = "Group for customers"
}

resource "aws_cognito_user" "network_admin_user" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = "network_admin"
  attributes = {
    email = "network_admin@example.com"
  }
  temporary_password   = "TempPassword123!"
  force_alias_creation = false
  message_action       = "SUPPRESS"
  depends_on           = [aws_cognito_user_group.network_admin_group]
}

resource "aws_cognito_user_in_group" "network_admin_membership" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = aws_cognito_user.network_admin_user.username
  group_name   = aws_cognito_user_group.network_admin_group.name
}

resource "aws_cognito_user" "cinema_admin_user" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = "cinema_admin"
  attributes = {
    email = "cinema_admin@example.com"
  }
  temporary_password   = "TempPassword123!"
  force_alias_creation = false
  message_action       = "SUPPRESS"
  depends_on           = [aws_cognito_user_group.cinema_admin_group]
}

resource "aws_cognito_user_in_group" "cinema_admin_membership" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = aws_cognito_user.cinema_admin_user.username
  group_name   = aws_cognito_user_group.cinema_admin_group.name
}

resource "aws_cognito_user" "employee_user" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = "employee"
  attributes = {
    email = "employee@example.com"
  }
  temporary_password   = "TempPassword123!"
  force_alias_creation = false
  message_action       = "SUPPRESS"
  depends_on           = [aws_cognito_user_group.employee_group]
}

resource "aws_cognito_user_in_group" "employee_membership" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = aws_cognito_user.employee_user.username
  group_name   = aws_cognito_user_group.employee_group.name
}

resource "aws_cognito_user" "customer_user" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = "customer"
  attributes = {
    email = "customer@example.com"
  }
  temporary_password   = "TempPassword123!"
  force_alias_creation = false
  message_action       = "SUPPRESS"
  depends_on           = [aws_cognito_user_group.customer_group]
}

resource "aws_cognito_user_in_group" "customer_membership" {
  user_pool_id = aws_cognito_user_pool.cinema_user_pool.id
  username     = aws_cognito_user.customer_user.username
  group_name   = aws_cognito_user_group.customer_group.name
}

output "COGNITO_CLIENT_ID" {
  value = aws_cognito_user_pool_client.cinema_user_pool_client.id
}

output "COGNITO_USER_POOL_ID" {
  value = aws_cognito_user_pool.cinema_user_pool.id
}

output "COGNITO_USER_POOL_DOMAIN" {
  value = aws_cognito_user_pool_domain.cinema_user_pool_domain.domain
}
