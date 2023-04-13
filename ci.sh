#!/bin/bash -e
echo "Running CI"
echo "Running eslint"
pnpm lint
echo "Running prettier"
pnpm prettier
echo "Running svelte-check"
pnpm check
echo "Building project, initializing test suite"
pnpm build
echo "Running Playwright tests"
pnpm test