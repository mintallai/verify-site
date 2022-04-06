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
  interface ManifestAssertions {
    'adobe.crypto.assertions': {
      ethereum?: string[];
      solana?: string[];
    };
  }
}

function isBetaResolver(manifest) {
  return !!manifest.assertions.get('adobe.beta')?.version;
}

function websiteResolver(manifest) {
  const site = manifest.assertions.get('stds.schema-org.CreativeWork')?.url;
  if (site) {
    const url = new URL(site);
    if (url.protocol === 'https:' && url.hostname === 'stock.adobe.com') {
      return site;
    }
  }
}

function web3Resolver(manifest) {
  const cryptoEntries = manifest.assertions.get('adobe.crypto.addresses') ?? {};
  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}

export async function getSdk() {
  if (!sdk) {
    try {
      sdk = await createC2pa({
        wasmSrc: `sdk/toolkit_bg.wasm?v=${process.env.GIT_REVISION}`,
        workerSrc: `sdk/cai-sdk.worker.min.js?v=${process.env.GIT_REVISION}`,
        manifestResolvers: {
          ...resolvers.editsAndActivityResolver,
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
