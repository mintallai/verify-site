import { ContentAuth } from '@contentauth/sdk';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    try {
      sdk = new ContentAuth({
        wasmSrc: 'sdk/toolkit_bg.wasm',
        workerSrc: 'sdk/cai-sdk.worker.min.js',
        downloadOptions: {
          inspectSize: 0,
        },
        poolOptions: {
          maxWorkers: Math.min(navigator.hardwareConcurrency ?? 4, 4),
        },
      });
    } catch (err) {
      console.error('Could not load SDK:', err);
      window.newrelic?.noticeError(err);
    }
  }

  return sdk;
}

export * from '@contentauth/sdk';
