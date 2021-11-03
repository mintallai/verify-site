terraform {
  backend "s3" {
    bucket = "cai-remote-state-shared"
    # tbd    dynamodb_table       = ""
    region               = "us-east-1"
    workspace_key_prefix = "verify-site/global"
    key                  = "terraform.tfstate"
    encrypt              = true
    profile              = "prod" #temporary until we have a shared account for state / access role
  }
}
