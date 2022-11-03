terraform {
  backend "s3" {
    bucket               = "adobe-cai-terraform-remote-state-ops"
    dynamodb_table       = "terraform-state-lock-ops"
    region               = "us-east-1"
    workspace_key_prefix = "verify-site/global"
    key                  = "terraform.tfstate"
    encrypt              = true
    profile              = "ops"
  }
}
