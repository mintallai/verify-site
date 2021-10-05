import { ContentAuth } from '@contentauth/sdk';
import wasmModule from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    const wasmSrc = await wasmModule();
    sdk = new ContentAuth({
      wasmSrc,
      workerSrc: 'cai-sdk.worker.min.js',
      downloadOptions: {
        inspectSize: 65535,
      },
      poolOptions: {
        size: 1,
      },
    });
  }

  return sdk;
}

export * from '@contentauth/sdk';
