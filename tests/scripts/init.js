const { promisify } = require('util');
const decompress = require('decompress');
const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');
const axios = require('axios');
const mkdirp = require('mkdirp');
const del = require('del');
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

const apiUser = process.env.ARTIFACTORY_USER;
const apiToken = process.env.ARTIFACTORY_API_TOKEN;
const assetsDir = path.resolve(__dirname, '../assets');
const extractDir = path.resolve(assetsDir, 'data');
const imagesUrl =
  'https://artifactory.corp.adobe.com/artifactory/generic-cai-images-test/latest.zip';

if (!apiUser) {
  console.error(
    'Please provide an ARTIFACTORY_USER env var when calling this script.',
  );
  process.exit(1);
}

if (!apiToken) {
  console.error(
    'Please provide an ARTIFACTORY_API_TOKEN env var when calling this script.',
  );
  process.exit(1);
}

const auth = {
  username: apiUser,
  password: apiToken,
};

async function getSHA() {
  try {
    const res = await axios.head(imagesUrl, { auth });
    return res.headers['x-checksum-sha256'];
  } catch (err) {
    console.error(
      'Could not connect to Artifactory. Please make sure you are on VPN or this script has the appropiate access.',
    );
    process.exit(1);
  }
}

function download(dest) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: imagesUrl,
      responseType: 'stream',
      auth,
    })
      .then((res) => {
        const contentLength = res.headers['content-length'];
        let downloaded = 0;
        res.data.pipe(fs.createWriteStream(dest));
        res.data.on('data', (chunk) => {
          downloaded += chunk.length;
          const pct = Math.round((downloaded / contentLength) * 100);
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(
            `Downloaded ${pct}% of archive (${downloaded}/${contentLength} bytes)`,
          );
        });
        res.data.on('close', () => resolve(dest));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

(async () => {
  await mkdirp(assetsDir);
  await del(extractDir);
  const latestSHA = await getSHA();
  const filename = `${latestSHA}.zip`;
  const outputDir = path.resolve(assetsDir, filename);
  const latestExists = await exists(outputDir);
  if (latestExists) {
    console.log('Latest exists at %s, skipping download', outputDir);
  } else {
    console.log('Latest not available, downloading file to %s', outputDir);
    await download(outputDir);
  }
  await decompress(outputDir, extractDir);
  console.log('Extracted %s to %s', outputDir, extractDir);
  const testFiles = await fg(['**/*.{jpg,jpeg,png}'], {
    cwd: extractDir,
  });
  const indexPath = path.resolve(extractDir, 'index.json');
  await writeFile(indexPath, JSON.stringify(testFiles));
  console.log('Wrote index to %s', indexPath);
})();
