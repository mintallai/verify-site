import { ContentAuth } from '@contentauth/sdk';
import wasmModule from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    try {
      const wasmSrc = await wasmModule();
      sdk = new ContentAuth({
        wasmSrc,
        workerSrc: 'cai-sdk.worker.min.js',
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
