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

import { exec as cbExec } from 'node:child_process';
import { promisify } from 'node:util';
import { Octokit } from 'octokit';

const exec = promisify(cbExec);

function isValidPr(number) {
  return /^\d+$/.test(number);
}

const octokit = new Octokit({
  auth: process.env.moonbeam_token,
  baseUrl: 'https://git.corp.adobe.com/api/v3',
});

async function deploy({ prNumber }) {
  const path = `/PR-${prNumber}`;
  console.log(`Building site with path: ${path}`);
  await exec(`pnpm build`, {
    env: {
      ...process.env,
      BASE_PATH: path,
    },
  });
  console.log(`Building Storybook`);
  await exec(`pnpm run build-storybook -o ./dist/storybook`);
  console.log(`Deploying site to S3`);
  await exec(
    `aws s3 sync ./dist s3://adobe-cai-verify-dev/dist/verify-site${path}`,
  );

  return {
    deployUrl: `https://verify-dev.contentauthenticity.org${path}`,
    storybookUrl: `https://verify-dev.contentauthenticity.org${path}/storybook/index.html`,
  };
}

async function postComment({
  owner,
  repo,
  prNumber,
  deployUrl,
  storybookUrl,
  sha,
}) {
  const pr = await octokit.request(
    `GET /repos/{owner}/{repo}/issues/{pull_number}/comments`,
    {
      owner,
      repo,
      pull_number: prNumber,
    },
  );
  const commentText = `<div id="moonbeam-deploy-info">
    <strong>✅ Deployed to <a href="${deployUrl}">${deployUrl}</a></strong><br/>
    📖 Storybook deployed to <a href="${storybookUrl}">${storybookUrl}</a><br/><br/>
    Deployed commit: <code>${sha}</code>
  </div>`;
  const existingComment = pr.data.find((comment) =>
    comment.body.includes('<div id="moonbeam-deploy-info">'),
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

async function ciHandler({ prNumber, repoPath, sha }) {
  const [owner, repo] = repoPath.split('/');

  if (isValidPr(prNumber)) {
    const { deployUrl, storybookUrl } = await deploy({ prNumber });
    await postComment({ owner, repo, prNumber, deployUrl, storybookUrl, sha });
  } else {
    console.log(`Invalid PR number received: ${prNumber}, skipping deploy`);
  }
}

ciHandler({
  prNumber: process.env.pr_numbers,
  repoPath: process.env.repo,
  sha: (process.env.sha || '').substring(0, 7),
});
