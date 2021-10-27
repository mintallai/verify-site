const { promisify } = require('util');
const decompress = require('decompress');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mkdirp = require('mkdirp');
const del = require('del');
const exists = promisify(fs.exists);

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
  const res = await axios.head(imagesUrl, { auth });
  return res.headers['x-checksum-sha256'];
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
  const outputPath = path.resolve(assetsDir, filename);
  const latestExists = await exists(outputPath);
  if (latestExists) {
    console.log('Latest exists at %s, skipping download', outputPath);
  } else {
    console.log('Latest not available, downloading file to %s', outputPath);
    await download(outputPath);
  }
  await decompress(outputPath, extractDir, { strip: 1 });
  console.log('Extracted %s to %s', outputPath, extractDir);
})();
