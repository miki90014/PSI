# S3 Bucket for Static Frontend Files for Employee
resource "aws_s3_bucket" "frontend_employee" {
  bucket = "frontend-employee"

  tags = {
    Environment = "Production"
    Application = "StaticFrontendEmployee"
  }
}

resource "aws_s3_bucket_website_configuration" "employee_website" {
  bucket = aws_s3_bucket.frontend_employee.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Disable block public access settings for Employee
resource "aws_s3_bucket_public_access_block" "employee_public_access" {
  bucket = aws_s3_bucket.frontend_employee.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_employee_policy" {
  bucket = aws_s3_bucket.frontend_employee.bucket
  policy = data.aws_iam_policy_document.frontend_employee_access.json

  depends_on = [aws_s3_bucket_public_access_block.employee_public_access]
}

# Policy document for Employee
data "aws_iam_policy_document" "frontend_employee_access" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.frontend_employee.arn}/*",
    ]
  }

  statement {
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"]
    }

    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject"
    ]

    resources = [
      "${aws_s3_bucket.frontend_employee.arn}/*",
    ]
  }
}

output "employee_s3_bucket_name" {
  value = aws_s3_bucket.frontend_employee.bucket
}

output "employee_website_endpoint" {
  value = aws_s3_bucket_website_configuration.employee_website.website_endpoint
}

resource "aws_s3_bucket_cors_configuration" "frontend_cinema_customer_cors" {
  bucket = aws_s3_bucket.frontend_employee.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
