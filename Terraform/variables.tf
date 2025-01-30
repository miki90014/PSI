variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

variable "rds_engine" {
  type    = string
  default = "mysql"
}

variable "rds_password" {
  type    = string
  default = "postgres123"
}

variable "rds_username" {
  type    = string
  default = "postgres"
}

variable "rds_customer" {
  type = string
}

variable "rds_employee" {
  type = string
}
