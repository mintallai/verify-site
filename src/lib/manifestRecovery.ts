// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

import type { Source } from 'c2pa';
import pLimit from 'p-limit';
import { resultToAssetMap, type AssetDataMap } from './asset';
import { getConfig } from './config';
import {
  CloudManifestError,
  ManifestRecoveryError,
  RemoteManifestError,
  S3UploadError,
  SearchUploadError,
} from './error';
import { resizeImage } from './resizeImage';
import { getSdk } from './sdk';

const apiKey = 'cai-verify-site';
const baseParams = { api_key: apiKey };

const limit = pLimit(navigator.hardwareConcurrency ?? 8);

export interface ManifestRecoveryResult {
  assetMap: AssetDataMap;
  source: Source;
}

export async function recoverManifests(
  sourceImage: Blob,
): Promise<ManifestRecoveryResult[]> {
  // @TODO force-stage functionality?
  const config = await getConfig();
  const baseUrl =
    config.env === 'prod'
      ? `https://cai-msb.adobe.io`
      : `https://cai-msb-stage.adobe.io`;
  const searchImage = await resizeImage(sourceImage);
  const { url, filename } = await getUploadUrlAndFilename(searchImage, baseUrl);

  if (await uploadToS3(url, searchImage)) {
    const manifests = await fetchManifests(filename, baseUrl);
    const sdk = await getSdk();

    const fetchedManifests = manifests?.results.map(({ url }) => {
      async function processResult() {
        const resultResponse = await fetch(url.replace(/\/assets\/.*$/, ''), {
          //TODO : remove this field once it's been solved on the service side
          mode: 'cors',
        });

        if (!resultResponse.ok) {
          throw new RemoteManifestError(resultResponse);
        }

        const resultData = await resultResponse.arrayBuffer();
        const blob = new Blob([resultData], {
          type: 'application/x-c2pa-manifest-store',
        });

        const result = await sdk.read(blob);

        const assetMap = await resultToAssetMap(result);

        // @TODO add manifest filtering?
        return {
          assetMap,
          source: result.source,
        } as ManifestRecoveryResult;
      }

      return limit(processResult);
    });

    if (!fetchedManifests) {
      throw new ManifestRecoveryError();
    }

    return Promise.all(fetchedManifests);
  }

  return [];
}

async function getUploadUrlAndFilename(sourceImage: Blob, baseUrl: string) {
  const body = JSON.stringify({ content_type: sourceImage.type });
  const headers = { 'Content-Type': 'application/json' };
  const params = new URLSearchParams(baseParams);

  const res = await fetch(`${baseUrl}/sign_upload/v1?${params.toString()}`, {
    method: 'POST',
    body,
    headers,
  });

  if (!res.ok) {
    throw new SearchUploadError(res);
  }

  return res.json();
}

async function uploadToS3(url: string, sourceImage: Blob) {
  const body = sourceImage;
  const headers = { 'Content-Type': sourceImage.type };

  const res = await fetch(url, { method: 'PUT', body, headers });

  if (res.status !== 200) {
    throw new S3UploadError(res);
  }

  return true;
}

interface ManifestResponse {
  results: ManifestResultItem[];
}

interface ManifestResultItem {
  signed_on: string;
  url: string;
}

async function fetchManifests(
  filename: string,
  baseUrl: string,
): Promise<ManifestResponse | null> {
  const params = new URLSearchParams({
    ...baseParams,
    filename: filename,
    real_search: '1',
  });
  const response = await fetch(`${baseUrl}/manifests/v1?${params.toString()}`);

  if (!response.ok) {
    throw new CloudManifestError(response);
  }

  const manifests = await response.json();
  return manifests;
}
