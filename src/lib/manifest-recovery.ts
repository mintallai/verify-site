import pLimit from 'p-limit';
import { getSdk, SdkResult } from '../lib/sdk';
const limit = pLimit(4);
import { activeAsset } from '../stores';

export const recoverManifests = async () => {
  try {
    const res = await fetch('/data/manifest-recovery.json');

    const data = await res.json();
    console.log(data.results.length);

    const sdk = await getSdk();
    const inputs = data.results?.map(({ url }) => {
      console.log('input url', url);
      const processResult = async () => {
        const resultResponse = await fetch(url, {
          mode: 'cors',
        });
        const resultData = await resultResponse.arrayBuffer();
        console.log('arrayBuffer', resultData);
        const blob = new Blob([resultData], {
          type: 'application/x-c2pa-manifest-store',
        });
        return sdk.read(blob);
      };
      return limit(processResult);
    });
    // Only one promise is run at once
    const result = await Promise.all(inputs);

    return result;
  } catch (err) {
    console.log(err);
  }
};
