// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

// import { ContentAuth } from '@contentauth/sdk';
import { createC2pa } from 'c2pa';

export type Sdk = Awaited<ReturnType<typeof createC2pa>>;
export type SdkResult = Awaited<ReturnType<Sdk['read']>>;
// TODO: Ping @mensch about the best way to do this
export type Manifest = SdkResult['manifestStore']['activeManifest'];
export type Ingredient = Manifest['ingredients'][number];
export type Source = SdkResult['source'];

let sdk: Sdk;

export async function getSdk() {
  if (!sdk) {
    try {
      sdk = await createC2pa({
        wasmSrc: 'sdk/toolkit_bg.wasm',
        workerSrc: 'sdk/cai-sdk.worker.min.js',
      });
      console.log('we got sdk', sdk);
      // sdk = new ContentAuth({
      //   wasmSrc: 'sdk/toolkit_bg.wasm',
      //   workerSrc: 'sdk/cai-sdk.worker.min.js',
      //   poolOptions: {
      //     maxWorkers: Math.min(navigator.hardwareConcurrency ?? 4, 4),
      //   },
      // });
    } catch (err) {
      console.error('Could not load SDK:', err);
      window.newrelic?.noticeError(err);
    }
  }

  return sdk;
}

export * from 'c2pa';
