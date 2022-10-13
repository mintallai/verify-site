import debug from 'debug';
import pLimit from 'p-limit';
import { get } from 'svelte/store';
import { getConfig } from '../lib/config';
import { getSdk } from '../lib/sdk';
import {
  forceProductionServices,
  OTGP_ERROR_CODE,
  searchError,
  sourceManifestStore,
} from '../stores';

const RESIZE_MAX_SIZE = 512;
const RESIZE_JPEG_QUALITY = 0.7;
const PROCESS_CONCURRENCY = 8;

const dbg = debug('manifest-recovery');
const limit = pLimit(PROCESS_CONCURRENCY);
const apiKey = 'cai-verify-site';
const baseParams = { api_key: apiKey };

const uploadToS3 = async (url, sourceImage) => {
  const body = sourceImage;
  const headers = { 'Content-Type': sourceImage.type };
  try {
    const res = await fetch(`${url}`, { method: 'PUT', body, headers });
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    searchError.set(true);
    throw new Error(`S3 upload failed`);
  }
};

const getUploadUrlAndFilename = async (sourceImage, baseUrl) => {
  const body = JSON.stringify({ content_type: sourceImage.type });
  const headers = { 'Content-Type': 'application/json' };
  const params = new URLSearchParams(baseParams);
  try {
    const res = await fetch(`${baseUrl}/sign_upload/v1?${params.toString()}`, {
      method: 'POST',
      body,
      headers,
    });
    if (res.ok) {
      return res.json();
    }
    throw new Error(
      `Got error response from search upload URL (${res.status})`,
    );
  } catch (err) {
    searchError.set(true);
    throw new Error(`Get search upload URL failed: ${err.message}`);
  }
};

/**
 * Exports a resized canvas as a JPEG since image-blob-reduce keeps the original
 * format, even though we always want a JPEG
 */
const exportCanvas: (canvas: HTMLCanvasElement) => Promise<Blob> = async (
  canvas,
) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob ? resolve(blob) : reject();
      },
      'image/jpeg',
      RESIZE_JPEG_QUALITY,
    );
  });
};

/**
 * Resizes image uploads to a smaller size for image search
 */
const resizeImage = async (sourceImage) => {
  const imageReducerModule = await import('image-blob-reduce');
  const imageReducer = imageReducerModule?.default?.();

  if (imageReducer) {
    const resizedCanvas = await imageReducer.toCanvas(sourceImage, {
      max: RESIZE_MAX_SIZE,
    });
    const resizedImage = await exportCanvas(resizedCanvas);
    dbg(`Resized image for upload`, {
      maxDimension: RESIZE_MAX_SIZE,
      sourceFilesize: sourceImage.size,
      resizedFilesize: resizedImage.size,
    });
    return resizedImage;
  }

  dbg('Could not resize image, using source image');
  return sourceImage;
};

const fetchManifests = async (filename: string, baseUrl) => {
  const params = new URLSearchParams({
    ...baseParams,
    filename: filename,
    real_search: '1',
  });

  try {
    const response = await fetch(
      `${baseUrl}/manifests/v1?${params.toString()}`,
    );
    if (!response.ok) {
      searchError.set(true);
    }
    const manifests = await response.json();
    return manifests;
  } catch (e) {
    searchError.set(true);
    throw new Error(`Fetching manifests failed`);
  }
};

export const recoverManifests = async () => {
  try {
    const sourceImage = get(sourceManifestStore)?.source.blob;
    if (!sourceImage) {
      dbg('Could not access source image');
      return;
    }

    const searchImage = await resizeImage(sourceImage);
    const config = await getConfig();
    const useProd = get(forceProductionServices) || config.env === 'prod';
    const baseUrl = useProd
      ? `https://cai-msb.adobe.io`
      : `https://cai-msb-stage.adobe.io`;
    const { url, filename } = await getUploadUrlAndFilename(
      searchImage,
      baseUrl,
    );

    if (await uploadToS3(url, searchImage)) {
      dbg('Upload to S3 succeded', { filename, sourceImage });
      const manifests = await fetchManifests(filename, baseUrl);
      dbg('Manifests search returned', manifests);
      const sdk = await getSdk();
      const inputs = manifests?.results?.map(({ url }) => {
        const processResult = async () => {
          const resultResponse = await fetch(url.replace(/\/assets\/.*$/, ''), {
            //TODO : remove this field once it's been solved on the service side
            mode: 'cors',
          });
          if (!resultResponse.ok) {
            searchError.set(true);
          }
          const resultData = await resultResponse.arrayBuffer();
          const blob = new Blob([resultData], {
            type: 'application/x-c2pa-manifest-store',
          });

          const res = await sdk.read(blob);

          if (res.manifestStore.validationStatus) {
            res.manifestStore.validationStatus =
              res.manifestStore.validationStatus.filter(
                (x) => x.code !== OTGP_ERROR_CODE,
              );
          }

          return res;
        };

        return limit(processResult);
      });
      // Only one promise is run at once
      return Promise.all(inputs);
    } else {
      dbg('Upload to S3 failed');
    }
  } catch (err) {
    searchError.set(true);
    dbg('Recover manifests failed', err);
    throw new Error(`Recover manifests failed`);
  }
};
