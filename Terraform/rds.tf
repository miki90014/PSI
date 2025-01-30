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

resource "aws_db_instance" "replica_employee_db" {
  instance_class      = "db.t3.micro"
  replicate_source_db = aws_db_instance.employee_db.identifier
  publicly_accessible = false
  skip_final_snapshot = true
  tags = {
    Name = "replica-employee-db"
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

resource "aws_db_instance" "replica_customer_db" {
  instance_class      = "db.t3.micro"
  replicate_source_db = aws_db_instance.customer_db.identifier
  publicly_accessible = false
  skip_final_snapshot = true
  tags = {
    Name = "replica-customer-db"
  }
}
