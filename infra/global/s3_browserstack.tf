module "s3_browserstack" {
  source = "git@git.corp.adobe.com:cai/shared-infra.git//modules/s3-bucket?ref=cors-s3"

  shortname = "browserstack"
  service   = "verify-site"
  use_cors  = true

  cors_rule = [{
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["https://s3-website-test.hashicorp.com"]
    expose_headers  = ["ETag"]
    max_age_seconds = ["3000"]
  }]
}

output "s3_browserstack_bucket_name" {
  value = module.s3_browserstack.bucket_name
}
