# S3 Bucket for Static Frontend Files
resource "aws_s3_bucket" "frontend_chef_connect_bucket" {
  bucket = "frontend-chef-connect"

  tags = {
    Environment = "Production"
    Application = "StaticFrontend"
  }
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.frontend_chef_connect_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Disable block public access settings
resource "aws_s3_bucket_public_access_block" "frontend_public_access" {
  bucket = aws_s3_bucket.frontend_chef_connect_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_chef_connect_bucket_policy" {
  bucket = aws_s3_bucket.frontend_chef_connect_bucket.bucket
  policy = data.aws_iam_policy_document.frontend_chef_connect_bucket_access.json

  depends_on = [aws_s3_bucket_public_access_block.frontend_public_access]
}

# Policy document
data "aws_iam_policy_document" "frontend_chef_connect_bucket_access" {
  # read access
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.frontend_chef_connect_bucket.arn}/*",
    ]
  }

  # deployment access
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
      "${aws_s3_bucket.frontend_chef_connect_bucket.arn}/*",
    ]
  }
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_chef_connect_bucket.bucket
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.example.website_endpoint
}
