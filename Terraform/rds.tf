resource "aws_db_instance" "employee_db" {
  engine              = var.rds_engine
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  username            = var.rds_username
  password            = var.rds_password
  skip_final_snapshot = true

  db_name                = "employee"
  vpc_security_group_ids = [aws_security_group.rds-sg.id]
  db_subnet_group_name   = aws_db_subnet_group.my_db_subnet_group.name
  tags = {
    Name = "employee-db"
  }
}

resource "aws_db_instance" "customer_db" {
  engine              = var.rds_engine
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  username            = var.rds_username
  password            = var.rds_password
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.rds-sg.id]
  db_subnet_group_name   = aws_db_subnet_group.my_db_subnet_group.name
  db_name                = "customer"
  tags = {
    Name = "customer-db"
  }
}

output "employee_endpoint" {
  value = aws_db_instance.employee_db.endpoint
}

output "customer_endpoint" {
  value = aws_db_instance.customer_db.endpoint
}
