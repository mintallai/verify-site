import { ContentAuth } from '@contentauth/sdk';
import wasmModule from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm';
import workerSrc from '@contentauth/sdk/dist/cai-sdk.worker.min.js';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    try {
      const wasmSrc = await wasmModule();
      sdk = new ContentAuth({
        wasmSrc,
        workerSrc,
        downloadOptions: {
          inspectSize: 0,
        },
        poolOptions: {
          size: Math.min(navigator.hardwareConcurrency, 4),
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
