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

import { ContentAuth } from '@contentauth/sdk';

let sdk: ContentAuth;

export async function getSdk() {
  if (!sdk) {
    try {
      sdk = new ContentAuth({
        wasmSrc: 'sdk/toolkit_bg.wasm',
        workerSrc: 'sdk/cai-sdk.worker.min.js',
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
