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

import { createC2pa, resolvers } from 'c2pa';

export type Sdk = Awaited<ReturnType<typeof createC2pa>>;
export type SdkResult = Awaited<ReturnType<Sdk['read']>>;
export type Manifest = SdkResult['manifestStore']['activeManifest'];
export type Ingredient = Manifest['ingredients'][number];
export type Source = SdkResult['source'];

let sdk: Sdk;

declare module 'c2pa' {
  interface ExtendedAssertions {
    'adobe.crypto.addresses': {
      ethereum?: string[];
      solana?: string[];
    };
    'adobe.beta': {
      version: string;
    };
  }
}

function isBetaResolver(manifest: Manifest) {
  return !!manifest.assertions.get('adobe.beta')?.data.version;
}

function websiteResolver(manifest: Manifest) {
  const site = manifest.assertions.get('stds.schema-org.CreativeWork')?.data
    .url;
  if (site) {
    const url = new URL(site);
    if (url.protocol === 'https:' && url.hostname === 'stock.adobe.com') {
      return site;
    }
  }
}

function web3Resolver(manifest: Manifest) {
  const cryptoEntries =
    manifest.assertions.get('adobe.crypto.addresses')?.data ?? {};
  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}

export async function getSdk() {
  if (!sdk) {
    try {
      sdk = await createC2pa({
        wasmSrc: 'sdk/toolkit_bg.wasm',
        workerSrc: 'sdk/c2pa.worker.min.js',
        manifestResolvers: {
          ...resolvers.editsAndActivity,
          isBeta: isBetaResolver,
          website: websiteResolver,
          web3: web3Resolver,
        },
      });
    } catch (err) {
      console.error('Could not load SDK:', err);
      window.newrelic?.noticeError(err);
    }
  }

  return sdk;
}

export * from 'c2pa';
