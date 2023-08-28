#!/bin/bash -e
echo "Running CI"

echo "Setting up AWS credentials"
mkdir ~/.aws
cat > ~/.aws/config << EOF
[default]
aws_access_key_id = $ci_aws_access_key_id
aws_secret_access_key = $ci_aws_secret_access_key
region = us-east-2
EOF

export PERCY_TOKEN=$percy_token
export PERCY_COMMIT=$sha
export PERCY_BRANCH=$branch
export PERCY_PARALLEL_NONCE=$build_id

echo "Running eslint"
pnpm lint
echo "Running prettier"
pnpm prettier
echo "Running svelte-check"
pnpm check
echo "Building project, initializing test suite"
pnpm build
echo "Running Playwright tests"
pnpm run test:ci

node ./etc/scripts/gh-preview.js
