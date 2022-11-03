module "s3_browserstack" {
  source = "git@git.corp.adobe.com:cai/shared-infra.git//modules/s3-bucket?ref=s3-bucket-1.1.1"

  shortname = "browserstack"
  service   = "verify-site"
  is_public = true
  use_cors  = true

  cors_rule = [{
    allowed_headers = ["Range"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = ["300"]
  }]
}

output "s3_browserstack_bucket_name" {
  value = module.s3_browserstack.bucket_name
}
