# verify-site

This project generates the CAI verify site front end.

## Get started

To run, check out this project and run:

```
yarn install
yarn dev
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
yarn build
# Run the test suite
yarn test
```

### Running tests for development

If you don't need to make any code changes to the site and just want to add or modify tests, you can run:

```shell
yarn run test:watch
```

If you want to edit tests _and_ edit the site, you can run:

```shell
# in terminal window #1
yarn dev
# in terminal window #2
yarn test:watch:local
```

### Testing in Docker/CI

You can run the tests in docker by running the following command:

```shell
make ci
```

This is what will get run when a commit is pushed in order to validate.

## Branching and tagging

Please see the [Branching and tagging policy in _How We Code_](https://git.corp.adobe.com/cai/how-we-code/blob/main/git.md#branching-for-deployed-services).

## Feature flagging

**TO DO:** @klein and @dkozma to follow up on how to use feature flags in a static site.
