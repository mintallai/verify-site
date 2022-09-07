import pLimit from 'p-limit';
import { getSdk } from '../lib/sdk';
import { sourceManifestStore } from '../stores';
import { get } from 'svelte/store';
import { getConfig } from '../lib/config';
import debug from 'debug';

const dbg = debug('manifest-recovery');
const limit = pLimit(4);
const apiKey = 'cai-verify-site';
const baseParams = { api_key: apiKey };

const uploadToS3 = async (url, sourceImage) => {
  const body = sourceImage;
  const headers = { 'Content-Type': sourceImage.type };
  try {
    const res = await fetch(`${url}`, { method: 'PUT', body, headers });
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    throw new Error(`S3 upload failed`);
  }
};

const getUploadUrlAndFilename = async (sourceImage, baseUrl) => {
  const body = JSON.stringify({ content_type: sourceImage.type });
  const headers = { 'Content-Type': 'application/json' };
  const params = new URLSearchParams(baseParams);
  try {
    const res = await fetch(`${baseUrl}/sign_upload/v1?${params.toString()}`, {
      method: 'POST',
      body,
      headers,
    });
    return res.json();
  } catch (err) {
    throw new Error(`Get search upload URL failed`);
  }
};

const fetchManifests = async (filename: string, baseUrl) => {
  const params = new URLSearchParams({
    ...baseParams,
    filename: filename,
    real_search: '1',
  });
  try {
    const manifests = await fetch(
      `${baseUrl}/manifests/v1?${params.toString()}`,
    );
    return manifests.json();
  } catch (err) {
    throw new Error(`Fetching manifests with filename failed`);
  }
};
export const recoverManifests = async () => {
  try {
    const sourceImage = get(sourceManifestStore)?.source.blob;
    if (!sourceImage) {
      return;
    }
    const config = await getConfig();
    const baseUrl =
      config.env === 'prod'
        ? `https://cai-msb.adobe.io`
        : `https://cai-msb-stage.adobe.io`;
    const { url, filename } = await getUploadUrlAndFilename(
      sourceImage,
      baseUrl,
    );
    if (await uploadToS3(url, sourceImage)) {
      dbg('Upload to S3 succeded', { filename, sourceImage });
      const manifests = await fetchManifests(filename, baseUrl);
      dbg('Manifests search returned', manifests);
      const sdk = await getSdk();
      const inputs = manifests.results?.map(({ url }) => {
        const processResult = async () => {
          const resultResponse = await fetch(url.replace(/\/assets\/.*$/, ''), {
            //TODO : remove this field once it's been solved on the service side
            mode: 'cors',
          });
          const resultData = await resultResponse.arrayBuffer();
          const blob = new Blob([resultData], {
            type: 'application/x-c2pa-manifest-store',
          });
          return sdk.read(blob);
        };
        return limit(processResult);
      });
      // Only one promise is run at once
      return Promise.all(inputs);
    } else {
      dbg('Upload to S3 failed');
    }
  } catch (err) {
    throw new Error(`Recover manifests failed`);
  }
};
