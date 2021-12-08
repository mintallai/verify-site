#!/bin/bash -e
echo "Running CI"
echo "Running routify scripts"
yarn routify -b
echo "Running svelte-check"
yarn svelte-check --threshold error
echo "Building project, initializing test suite"
yarn build
echo "Running Playwright tests"
yarn test