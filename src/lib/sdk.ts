import { ContentAuth } from '@contentauth/sdk';
import wasmModule from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    console.log('instantiating SDK');
    const wasmSrc = await wasmModule();
    console.log('wasmSrc', wasmSrc);
    sdk = new ContentAuth({
      wasmSrc,
      workerSrc: '/cai-sdk.worker.min.js',
      downloadOptions: {
        inspectSize: 0,
      },
      poolOptions: {
        size: Math.min(navigator.hardwareConcurrency, 4),
      },
    });
    console.log('sdk', sdk);
  }

  return sdk;
}

export * from '@contentauth/sdk';
