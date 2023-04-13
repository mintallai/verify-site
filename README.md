# verify-site

This project generates the CAI verify site front end.

## Deployment

This site is managed by [moonbeam](https://moonbeam.ethos.corp.adobe.com/cai/verify-site). All PRs should be merged through moonbeam, **NOT** via the GitHub interface.

## Get Started

To run, check out this project and run:

```
pnpm install
pnpm dev
```

## Debugging

To view debug messages in the console, you can load your browser's inspector, go to the Console tab, and enter:

```js
// For all of the messages
localStorage.debug = '*';
// For just messages related to the toolkit and data store
localStorage.debug = 'toolkit,store';
// To turn off debug logs
localStorage.debug = false;
```

## Testing

Our main integration tests are run via [Playwright](https://playwright.dev/). The first time you run the tests, you need to run the following after the main `yarn install` for the project:

```shell
# Install supported browsers so Playwright can use them
npx playwright install
```

Then, to run the tests, you can run:

```shell
# Build the site from the current code
pnpm build
# Run the test suite
pnpm test
```

### Running tests for development

If you don't need to make any code changes to the site and just want to add or modify tests, you can run:

```shell
pnpm test:watch:unit
```

If you want to edit tests _and_ edit the site, you can run:

```shell
# in terminal window #1
pnpm dev
# in terminal window #2
pnpm test:watch:unit
```

### Testing in Docker/CI

You can run the tests in docker by running the following command:

```shell
make ci
```

This is what will get run when a commit is pushed in order to validate.

## Branching and tagging

Please see the [Branching and tagging policy in _How We Code_](https://git.corp.adobe.com/cai/how-we-code/blob/main/git.md#branching-for-deployed-services).
