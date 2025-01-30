
resource "aws_api_gateway_rest_api" "cinema_api" {
  name        = "cinema-api"
  description = "REST API gateway for cinema app"
}

resource "aws_api_gateway_resource" "customer" {
  rest_api_id = aws_api_gateway_rest_api.cinema_api.id
  parent_id   = aws_api_gateway_rest_api.cinema_api.root_resource_id
  path_part   = "customer"
}

resource "aws_api_gateway_method" "customer_method" {
  rest_api_id   = aws_api_gateway_rest_api.cinema_api.id
  resource_id   = aws_api_gateway_resource.customer.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "customer_integration" {
  rest_api_id             = aws_api_gateway_rest_api.cinema_api.id
  resource_id             = aws_api_gateway_resource.customer.id
  http_method             = aws_api_gateway_method.customer_method.http_method
  type                    = "HTTP_PROXY"
  integration_http_method = "ANY"
  uri                     = "http://${aws_lb.cinema_alb.dns_name}/customer"

  depends_on = [aws_api_gateway_method.customer_method]
}

resource "aws_api_gateway_resource" "employee" {
  rest_api_id = aws_api_gateway_rest_api.cinema_api.id
  parent_id   = aws_api_gateway_rest_api.cinema_api.root_resource_id
  path_part   = "employee"
}

resource "aws_api_gateway_method" "employee_method" {
  rest_api_id   = aws_api_gateway_rest_api.cinema_api.id
  resource_id   = aws_api_gateway_resource.employee.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "employee_integration" {
  rest_api_id             = aws_api_gateway_rest_api.cinema_api.id
  resource_id             = aws_api_gateway_resource.employee.id
  http_method             = aws_api_gateway_method.employee_method.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_lb.cinema_alb.dns_name}/employee"

  depends_on = [aws_api_gateway_method.employee_method]
}

resource "aws_api_gateway_deployment" "cinema_api_deployment" {
  depends_on = [
    aws_api_gateway_method.customer_method,
    aws_api_gateway_method.employee_method,
    aws_api_gateway_integration.customer_integration,
    aws_api_gateway_integration.employee_integration,
  ]
  rest_api_id = aws_api_gateway_rest_api.cinema_api.id
}
