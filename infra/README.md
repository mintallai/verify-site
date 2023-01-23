# Infra Deployment

Terraform definitions for service infrastructure is maintained here.

## Folder Structure

The `global` folder is for infrastructure that is not dependent on region, like S3. `us-east-1` etc folders are for infrastructure managed in that region.

## Usage

Terraform workspaces are `stage` and `prod`. To deploy locally, run `terraform init` in the relevant folder, then `terraform workspace select stage/prod` and `terraform apply`.
