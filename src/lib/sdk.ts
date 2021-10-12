import { ContentAuth } from '@contentauth/sdk';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    sdk = new ContentAuth({
      wasmSrc: 'sdk/toolkit_bg.wasm',
      workerSrc: 'sdk/cai-sdk.worker.min.js',
      downloadOptions: {
        inspectSize: 0,
      },
      poolOptions: {
        size: Math.min(navigator.hardwareConcurrency, 4),
      },
    });
  }

  return sdk;
}

export * from '@contentauth/sdk';
