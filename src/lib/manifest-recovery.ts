import pLimit from 'p-limit';
import { getSdk, SdkResult } from '../lib/sdk';
const limit = pLimit(4);
import { activeAsset, urlParams, sourceManifestStore } from '../stores';
import { get } from 'svelte/store';
const baseUrl = `https://cai-msb-stage.adobe.io`;
const apiKey = 'cai-verify-site';

const uploadToS3 = async (url, sourceImage) => {
  const body = sourceImage;
  const headers = { 'Content-Type': sourceImage.type };
  try {
    const res = await fetch(`${url}`, { method: 'PUT', body, headers });
    return res.status;
  } catch (err) {
    return err;
  }
};

const getUploadUrlAndFilename = async (sourceImage) => {
  console.log(sourceImage);
  const body = JSON.stringify({ content_type: sourceImage.type });
  const headers = { 'Content-Type': 'application/json' };
  try {
    const res = await fetch(`${baseUrl}/sign_upload/v1?api_key=${apiKey}`, {
      method: 'POST',
      body,
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};

const fetchManifests = async (filename) => {
  try {
    const manifests = await fetch(
      `${baseUrl}/manifests/v1?api_key=cai-verify-site&real_search=1&filename=${filename}`,
    );
    return manifests;
  } catch (err) {
    return err;
  }
};
export const recoverManifests = async () => {
  try {
    const sourceImage = get(sourceManifestStore)?.source.blob;
    const data = await getUploadUrlAndFilename(sourceImage);
    const url = data.url;
    const filename = data.filename;
    console.log(data);
    if ((await uploadToS3(url, sourceImage)) === 200) {
      const res = await fetchManifests(filename);
      const manifests = await res.json();
      console.log(manifests.results);
      const sdk = await getSdk();
      const inputs = manifests.results?.map(({ url }) => {
        console.log('input url', url);
        const processResult = async () => {
          const resultResponse = await fetch(url.replace(/\/assets\/.*$/, ''), {
            mode: 'cors',
          });
          const resultData = await resultResponse.arrayBuffer();
          console.log('arrayBuffer', resultData);
          const blob = new Blob([resultData], {
            type: 'application/x-c2pa-manifest-store',
          });
          console.log(blob.type);
          return sdk.read(blob);
        };
        return limit(processResult);
      });
      // Only one promise is run at once
      const result = await Promise.all(inputs);
      return result;
    }
  } catch (err) {
    console.log(err);
  }
};
