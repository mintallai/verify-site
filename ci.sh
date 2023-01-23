#!/bin/bash -e
echo "Running CI"
echo "Running svelte-check"
yarn svelte-check
echo "Building project, initializing test suite"
yarn build
echo "Running Playwright tests"
yarn test