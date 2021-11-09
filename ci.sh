#!/bin/bash -e
echo "Running CI"
echo "Building project, initializing test suite"
yarn run test:init
echo "Running Playwright tests"
yarn playwright test