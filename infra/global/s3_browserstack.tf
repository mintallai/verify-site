module "s3_browserstack" {
  source = "git@git.corp.adobe.com:cai/shared-infra.git"

  shortname = "browserstack"
  service   = "verify-site"
}

output "s3_browserstack_bucket_name" {
  value = module.s3_browserstack.bucket_name
}
