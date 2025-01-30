resource "aws_db_instance" "employee_db" {
  engine              = var.rds_engine
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  username            = var.rds_username
  password            = var.rds_password
  publicly_accessible = false
  skip_final_snapshot = true
  multi_az            = false
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
  publicly_accessible = false
  skip_final_snapshot = true
  multi_az            = false
  tags = {
    Name = "customer-db"
  }
}
