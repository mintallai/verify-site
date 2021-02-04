# verify-site

This project generates the CAI verify site front end.

## Get Started

To run, check out this project and run:

```
yarn install
yarn dev
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
