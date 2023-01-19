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

import { createC2pa, Manifest } from 'c2pa';
import pMemoize from 'p-memoize';
import type { ExifTags } from './exif';
declare module 'c2pa' {
  interface ExtendedAssertions {
    'adobe.crypto.addresses': {
      ethereum?: string[];
      solana?: string[];
    };
    'adobe.beta': {
      version: string;
    };
    'stds.exif': ExifTags;
  }
}

async function createSdk() {
  try {
    return await createC2pa({
      wasmSrc: 'sdk/toolkit_bg.wasm',
      workerSrc: 'sdk/c2pa.worker.min.js',
      downloaderOptions: {
        inspectSize: 0,
      },
    });
  } catch (err) {
    console.error('Could not load SDK:', err);
    window.newrelic?.noticeError(err);
  }
}
export const getSdk = pMemoize(createSdk);

export function selectIsBeta(manifest: Manifest) {
  return !!manifest.assertions.get('adobe.beta')[0]?.data.version;
}

export function selectEditsAndActivityExists(manifest: Manifest) {
  return manifest.assertions.get('c2pa.actions')?.length > 0;
}

export function selectWebsite(manifest: Manifest) {
  const site = manifest.assertions.get('stds.schema-org.CreativeWork')[0]?.data
    .url;

  if (site) {
    const url = new URL(site);
    if (url.protocol === 'https:' && url.hostname === 'stock.adobe.com') {
      return site;
    }
  }
}

export function selectWeb3(manifest: Manifest) {
  const cryptoEntries =
    manifest.assertions.get('adobe.crypto.addresses')[0]?.data ?? {};

  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}

export function selectFormattedGenerator(manifest: Manifest) {
  const value = manifest.claimGenerator;
  // We are stripping parenthesis so that any version matches in there don't influence the test
  const withoutParens = value.replace(/\([^\)]*\)/g, '');
  if (/\s+\d+\.\d(\.\d)*\s+/.test(withoutParens)) {
    // Old-style (XMP Agent) string (match space + version)
    return value.split('(')[0]?.trim();
  } else {
    // User-Agent string
    // Split by space (the RFC uses the space as a separator)
    const firstItem = withoutParens.split(/\s+/)?.[0] ?? '';
    // Parse product name from version
    // Adobe_Photoshop/23.3.1 -> [Adobe_Photoshop, 23.3.1]
    const [product, version] = firstItem.split('/');
    // Replace underscores with spaces
    // Adobe_Photoshop -> Adobe Photoshop
    const formattedProduct = product.replace(/_/g, ' ');
    if (version) {
      return `${formattedProduct} ${version}`;
    }
    return formattedProduct;
  }
}

export function selectIsOriginal(manifest: Manifest) {
  if (!manifest) {
    return false;
  }

  const noIngredients = manifest.ingredients?.length === 0;
  const actions = manifest.assertions.get('c2pa.actions')[0]?.data?.actions;
  const isDelivered = actions?.some((x) => x.action === 'adobe.delivered');

  return noIngredients && !isDelivered;
}

export function selectReviewRatings(manifest: Manifest) {
  const ingredientRatings = manifest?.ingredients?.reduce((acc, ingredient) => {
    return [...acc, ...(ingredient.metadata?.reviewRatings ?? [])];
  }, []);
  const actionRatings =
    // @ts-ignore
    manifest.assertions.get('c2pa.actions')[0]?.data?.metadata?.reviewRatings ??
    [];
  const reviewRatings = [...ingredientRatings, ...actionRatings];

  return {
    hasUnknownActions: reviewRatings.some((review) =>
      ['actions.unknownActionsPerformed', 'actions.possiblyMissing'].includes(
        review.code,
      ),
    ),
    wasPossiblyModified: reviewRatings.some(
      (review) => review.code === 'ingredient.possiblyModified',
    ),
  };
}

export function selectFormattedDate(manifest: Manifest) {
  return manifest?.signatureInfo?.time
    ? new Date(manifest.signatureInfo.time)
    : null;
}
