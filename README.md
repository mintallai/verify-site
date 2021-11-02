# verify-site

This project generates the CAI verify site front end.

## Get Started

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
# Build the site from the current code and download test assets from Artifactory
yarn run test:init
# Run the test suite
yarn run test
```

**Note:** Please make sure you are on VPN and have your `ARTIFACTORY_USER` and `ARTIFACTORY_API_TOKEN` environment variables set in your terminal so that the test images download correctly.

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

## Branching and Tagging Policy

_(This policy should be applied to all future **hosted services** from the CAI team. This policy does not apply to library and application projects. A separate policy is being drafted as of this writing.)_

This project is built and deployed using [Ethos and Moonbeam](https://wiki.corp.adobe.com/display/ethos/Ethos+-+More+About+Ethos). Moonbeam is a highly-opinionated CI/CD pipeline. Our policies for this project (below) are based on Moonbeam's conventions:

* **The `master` branch reflects what is currently deployed to production.** (Changing the Moonbeam default branch name is blocked by [Jira EON-9110: Support Github's future support of removing "master" as default branch](https://jira.corp.adobe.com/browse/EON-9110). Please go cast a vote for this to be addressed.)

* **All pull requests should target the `master` branch.** In this repo, we do not currently make use of alternate-branch merging. There is only a single pipeline.

* **In general, individual releases to production should not be tagged.** In the Moonbeam model, every merge to `master` branch is a deployment, so the commit history itself identifies what was released and when.

* **Notable releases (e.g. major milestones, presentations, or events) should be tagged.** Use the syntax `yyyy-mm-dd-(name-of-event)` where the event name is in lower-case kebab-case for such tags (e.g. `2020-10-05-max-demo`).

* **Semantic versioning does not apply.**

For more detail on how to use Moonbeam, please see the [Moonbeam FAQ](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=ethos&title=FAQ+-+Moonbeam).

## Feature Flagging

**TO DO:** @klein and @dkozma to follow up on how to use feature flags in a static site.
