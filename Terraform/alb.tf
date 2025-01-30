resource "aws_lb" "cinema_alb" {
  name               = "chat-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.public_subnet[*].id
}

resource "aws_lb_target_group" "backend-customer_tg" {
  name        = "backend-customer-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.cinema_vpc.id
  target_type = "ip"
}

resource "aws_lb_target_group" "backend-employee_tg" {
  name        = "backend-employee-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.cinema_vpc.id
  target_type = "ip"
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.cinema_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "404 Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "customer_rule" {
  listener_arn = aws_lb_listener.http_listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend-customer_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/customer*"]
    }
  }
}

resource "aws_lb_listener_rule" "employee_rule" {
  listener_arn = aws_lb_listener.http_listener.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend-employee_tg.arn
  }
  condition {
    path_pattern {
      values = ["/api/employee*"]
    }
  }
}

output "alb_dns_name" {
  value = aws_lb.cinema_alb.dns_name
}
