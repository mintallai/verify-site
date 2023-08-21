// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import fetch from 'node-fetch';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { Octokit } from 'octokit';
import pWhilst from 'p-whilst';

const PERCY_BIN = resolve('node_modules', '.bin', 'percy');
const PLAYWRIGHT_BIN = resolve('node_modules', '.bin', 'playwright');
const PERCY_API_URL = 'https://percy.io/api/v1';
const PERCY_TOKEN = process.env.PERCY_TOKEN;
const PERCY_POLL_MS = 10000;
const FINISHED_STATES = ['expired', 'failed', 'finished'];
const INCOMPLETE_REVIEW_STATES = ['changes_requested', 'unreviewed'];
const ERROR_STATES = ['expired', 'failed'];

function isValidPr(number) {
  return /^\d+$/.test(number);
}

const octokit = new Octokit({
  auth: process.env.moonbeam_token,
  baseUrl: 'https://git.corp.adobe.com/api/v3',
});

async function postComment(
  { owner, repo, prNumber, sha },
  { title, buildId, buildUrl },
) {
  const pr = await octokit.request(
    `GET /repos/{owner}/{repo}/issues/{pull_number}/comments`,
    {
      owner,
      repo,
      pull_number: prNumber,
    },
  );
  const commentText = `<div id="percy-test-info">
    <strong>${title}</strong> ${
    buildId ? `(<a href="${buildUrl}" target="_blank">${buildId}</a>)` : ``
  }<br/>
    ${
      buildUrl
        ? `<strong>🔗 Percy test URL: <a href="${buildUrl}" target="_blank">${buildUrl}</a></strong><br/>`
        : `<br/>`
    }
    Test commit: <code>${sha}</code>
  </div>`;
  const existingComment = pr.data.find((comment) =>
    comment.body.includes('<div id="percy-test-info">'),
  );
  if (existingComment) {
    await octokit.request(
      `PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}`,
      {
        owner,
        repo,
        comment_id: existingComment.id,
        body: commentText,
      },
    );
  } else {
    await octokit.request(
      `POST /repos/{owner}/{repo}/issues/{pull_number}/comments`,
      {
        owner,
        repo,
        pull_number: prNumber,
        body: commentText,
      },
    );
  }
}

async function runTests({ sha, branch, nonce }) {
  return new Promise((resolve, reject) => {
    let buildUrl, buildId;

    const testProcess = spawn(
      PERCY_BIN,
      ['exec', '--', PLAYWRIGHT_BIN, 'test'],
      {
        env: {
          ...process.env,
          PERCY_TOKEN,
          PERCY_COMMIT: sha,
          PERCY_BRANCH: branch,
          PERCY_PARALLEL_NONCE: nonce,
        },
      },
    );

    function handleOutput(output) {
      const data = `${output}`.trim();
      console.log(data);
      const matcher =
        /Finalized build #(\d+): (https:\/\/percy.io\/[a-f0-9]+\/verify-site\/builds\/(\d+))/gi;
      const matches = matcher.exec(data);
      if (matches) {
        buildUrl = matches[2];
        buildId = matches[3];
        resolve({ buildUrl, buildId });
      }
    }

    testProcess.stdout.on('data', handleOutput);
    testProcess.stderr.on('data', handleOutput);

    testProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code !== 0) reject();
    });
  });
}

function getState(buildData) {
  const state = buildData?.attributes?.state;
  const reviewState = buildData?.attributes?.['review-state'];

  if (state === 'finished' && INCOMPLETE_REVIEW_STATES.includes(reviewState)) {
    return reviewState;
  }

  return state;
}

async function getBuildStatus({ buildId, branch }) {
  const headers = {
    Authorization: `Token ${PERCY_TOKEN}`,
  };
  const buildResult = await fetch(`${PERCY_API_URL}/builds/${buildId}`, {
    headers,
  });
  const buildData = (await buildResult.json())?.data;
  const buildNumber = buildData?.attributes?.['build-number'];
  const projectId = buildData?.relationships?.project?.data?.id;
  let state = getState(buildData);
  const error = buildData?.errors?.[0]?.status;

  if (error) {
    return error;
  }

  if (!FINISHED_STATES.includes(state)) {
    // If not a finished state, check other builds of this branch
    const query = new URLSearchParams({
      project_id: projectId,
      'filter[branch]': branch,
    });
    const result = await fetch(`${PERCY_API_URL}/builds?${query.toString()}`, {
      headers,
    });
    const data = (await result.json())?.data;
    const finishedFutureBuilds = data.filter((build) => {
      return (
        build.attributes['build-number'] > buildNumber &&
        FINISHED_STATES.includes(build.attributes.state)
      );
    });
    if (finishedFutureBuilds.length > 0) {
      // Take status of next completed build
      state = finishedFutureBuilds[0].attributes.state;
    }
  }

  return state;
}

async function runTestMonitor(params) {
  const { buildUrl, buildId, branch } = params;
  const status = await getBuildStatus({ buildId, branch });
  switch (status) {
    case 'processing':
      await postComment(params, {
        title: `⏳ Running Percy tests`,
        buildUrl,
        buildId,
      });
      return { status, done: false };
    case 'failed':
      await postComment(params, {
        title: `❌ Percy tests failed`,
        buildUrl,
        buildId,
      });
      return { status, done: true };
    case 'finished':
      await postComment(params, {
        title: `✅ Percy tests passed/approved`,
        buildUrl,
        buildId,
      });
      return { status, done: true };
    case 'unreviewed':
      await postComment(params, {
        title: `⚠️ Percy review needed`,
        buildUrl,
        buildId,
      });
      return { status, done: false };
    case 'changes_requested':
      await postComment(params, {
        title: `⚠️ Changes requested`,
        buildUrl,
        buildId,
      });
      return { status, done: false };
    case 'pending':
      await postComment(params, {
        title: `⚠️ Percy review needed (pending)`,
        buildUrl,
        buildId,
      });
      return { status, done: false };
    case 'unsaved':
      await postComment(params, {
        title: `❓ Percy status is unsaved`,
        buildUrl,
        buildId,
      });
      return { status, done: false };
    case 'waiting':
      await postComment(params, {
        title: `⚠️ Percy review needed (waiting)`,
        buildUrl,
        buildId,
      });
      return { status, done: false };
    case undefined:
      return { status, done: false };
    default:
      await postComment(params, {
        title: `❓ Percy status unhandled, existing (${status})`,
        buildUrl,
        buildId,
      });
      return { status, done: true };
  }
}

async function runPercy(params) {
  const { sha, branch } = params;
  await postComment(params, { title: `📦 Starting Percy tests…` });
  const { buildUrl, buildId } = await runTests({ sha, branch });
  let done = false;
  let status = undefined;

  await pWhilst(
    () => !done,
    async () => {
      ({ done, status } = await runTestMonitor({
        ...params,
        buildUrl,
        buildId,
      }));
      if (!done) {
        await setTimeout(PERCY_POLL_MS);
      }
    },
  );

  const exitCode = ERROR_STATES.includes(status) ? 1 : 0;
  process.exit(exitCode);
}

async function percyHandler(params) {
  const { prNumber, repoPath } = params;
  const [owner, repo] = repoPath.split('/');
  if (isValidPr(prNumber)) {
    await runPercy({ ...params, owner, repo });
  } else {
    console.log(`Invalid PR number received: ${prNumber}, failing test`);
    process.exit(1);
  }
}

percyHandler({
  prNumber: process.env.pr_numbers,
  repoPath: process.env.repo,
  branch: process.env.branch,
  sha: (process.env.sha || '').substring(0, 7),
  nonce: process.env.PERCY_PARALLEL_NONCE ?? process.env.sha,
});
