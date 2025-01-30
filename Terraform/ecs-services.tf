data "aws_caller_identity" "current" {}

resource "aws_cloudwatch_log_group" "employee_log_group" {
  name              = "/ecs/backend-employee"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "customer_log_group" {
  name              = "/ecs/backend-customer"
  retention_in_days = 7
}
resource "aws_ecs_task_definition" "backend-employee" {
  family                   = "backend-employee"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"

  task_role_arn      = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  execution_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  container_definitions = jsonencode([
    {
      name   = "backend-employee"
      image  = "nginx:latest"
      cpu    = 512
      memory = 1024

      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        { name = "DATABASE_URL", value = var.rds_employee },
        { name = "POSTGRES_USER", value = var.rds_username },
        { name = "POSTGRES_PASSWORD", value = var.rds_password },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/backend-employee"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "backend-employee"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "backend-customer" {
  family                   = "backend-customer"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"

  task_role_arn      = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  execution_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  container_definitions = jsonencode([
    {
      name      = "backend-customer"
      image     = "nginx:latest"
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        { name = "DATABASE_URL", value = var.rds_employee },
        { name = "POSTGRES_USER", value = var.rds_username },
        { name = "POSTGRES_PASSWORD", value = var.rds_password },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/backend-customer"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "backend-customer"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "backend-employee_service" {
  name            = "backend-employee-service"
  cluster         = aws_ecs_cluster.app-cluster.id
  task_definition = aws_ecs_task_definition.backend-employee.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet[*].id
    security_groups  = [aws_security_group.backend-sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend"
    container_port   = 5000
  }
  depends_on = [aws_lb_listener.http_listener]
}

resource "aws_ecs_service" "backend-customer_service" {
  name            = "backend-customer-service"
  cluster         = aws_ecs_cluster.app-cluster.id
  task_definition = aws_ecs_task_definition.backend-customer.arn
  desired_count   = 30
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet[*].id
    security_groups  = [aws_security_group.backend-sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend-customer"
    container_port   = 5000
  }
}
