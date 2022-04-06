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

import { setContext } from 'svelte';
import { get } from 'svelte/store';
import dragDrop from 'drag-drop';
import { page } from '@roxi/routify';
import { postEvent, IngestPayload } from '../lib/analytics';
import { getSdk, SdkResult } from '../lib/sdk';
import { getConfig } from '../lib/config';
import {
  urlParams,
  provenance,
  setProvenance,
  setIsLoading,
  lastUrlSource,
  dialog,
} from '../stores';

export const CONTEXT_KEY = 'loader';

export interface ILoaderParams {
  onError: (error: Error, message: string) => void;
  onLoaded: () => void;
  onDragStateChange: (isDragging: boolean) => void;
}

function getErrorMessage(err: Error) {
  if (err.name === 'InvalidMimeTypeError') {
    return 'error.unsupportedType';
  }
  return 'error.unknown';
}

function logLegacyContentCredentials(type: IngestPayload['ui.view_type']) {
  postEvent({
    'event.type': 'legacy_cc',
    'event.subtype': 'verify',
    'ui.view_type': type,
  });
}

function logLegacyRedirect(type: IngestPayload['ui.view_type']) {
  postEvent({
    'event.type': 'click',
    'event.subtype': 'legacy_verify',
    'ui.view_type': type,
  });
}

function logSuccess(result: SdkResult, type: IngestPayload['ui.view_type']) {
  postEvent({
    'event.type': 'success',
    'event.subtype': 'verify',
    'event.value': result?.manifestStore ? 'full' : 'none',
    'ui.view_type': type,
  });
}

function logError(err, type: IngestPayload['ui.view_type']) {
  postEvent({
    'event.type': 'error',
    'event.subtype': 'verify',
    'event.error_type': err.name,
    'event.error_desc': err.message,
    'ui.view_type': type,
  });
}

function showLegacyCredentialModal(source: File | string) {
  dialog.set({
    headlineKey: 'dialog.legacyContentCredentials.headline',
    contentKey: 'dialog.legacyContentCredentials.content',
    open: true,
    onCancel: () => dialog.update((x) => ({ ...x, open: false })),
    onConfirm: async () => {
      const config = await getConfig();
      const legacyVerifyUrl =
        config.env === 'stage'
          ? 'https://verify-beta-stage.contentauthenticity.org'
          : 'https://verify-beta.contentauthenticity.org';
      const path = get(page)?.path ?? '/';
      const redirectTo = `${legacyVerifyUrl}${path}`;
      if (typeof source === 'string') {
        logLegacyRedirect('link');
        window.location.assign(`${redirectTo}?source=${source}`);
      } else {
        logLegacyRedirect('upload');
        window.location.assign(redirectTo);
      }
    },
  });
}

async function hasLegacyCredentials(source: File | string) {
  try {
    const legacySdk = 'https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12';
    const wasmSrc =
      'https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12/dist/assets/wasm/toolkit_bg.wasm';
    const workerSrc =
      'https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12/dist/cai-sdk.worker.min.js';
    const { ContentAuth } = await import(legacySdk);
    const sdk = new ContentAuth({
      wasmSrc,
      workerSrc,
    });
    const result = await sdk.processImage(source);
    return result.exists;
  } catch (err) {
    console.error('Error when testing for legacy credential version', err);
  }
  return null;
}

async function processSourceImage(sourceParam: string, params: ILoaderParams) {
  const onSuccess = (result) => {
    setProvenance(result);
    lastUrlSource.set(sourceParam);
    logSuccess(result, 'link');
  };
  setIsLoading(true);
  try {
    const sdk = await getSdk();
    const result = await sdk.read(sourceParam);
    await window.newrelic?.setCustomAttribute('source', sourceParam);
    if (result?.manifestStore) {
      onSuccess(result);
    } else {
      const isLegacy = await hasLegacyCredentials(sourceParam);
      if (isLegacy) {
        logLegacyContentCredentials('link');
        showLegacyCredentialModal(sourceParam);
      } else {
        onSuccess(result);
      }
    }

    params.onLoaded();
  } catch (err) {
    logError(err, 'link');
    window.newrelic?.noticeError(err, {
      source: 'url',
    });
    params.onError(err, getErrorMessage(err));
  } finally {
    setIsLoading(false);
  }
}

export async function processFiles(
  files: File[] | FileList,
  params: ILoaderParams,
) {
  const fileArray = Array.from(files);
  const onSuccess = (result) => {
    setProvenance(result);
    logSuccess(result, 'upload');
  };
  if (fileArray.length) {
    setIsLoading(true);
    const sdk = await getSdk();
    const file = fileArray[0];
    setProvenance(null);
    window.newrelic?.addPageAction('loadedUserFile', {
      type: file.type,
    });
    try {
      const result = await sdk.read(file);
      if (result.manifestStore) {
        onSuccess(result);
      } else {
        const legacyResult = await hasLegacyCredentials(file);
        if (legacyResult) {
          logLegacyContentCredentials('upload');
          showLegacyCredentialModal(file);
        } else {
          // Only change UI if it is not a newer image
          onSuccess(result);
        }
      }
    } catch (err) {
      logError(err, 'upload');
      window.newrelic?.noticeError(err, {
        source: 'file',
        type: file.type,
      });
      params.onError(err, getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }
}

export function setLoaderContext(params: ILoaderParams) {
  setContext(CONTEXT_KEY, {
    loadFile() {
      processFiles(this.files, params);
    },
  });
}

export function loader(node, params: ILoaderParams) {
  const { onDragStateChange, onError } = params;
  const sourceParam = get(urlParams).source;
  const prov = get(provenance);
  const sourceChanged = get(lastUrlSource) !== sourceParam;

  if (sourceParam && (!prov || (prov && sourceChanged))) {
    processSourceImage(sourceParam, params);
  }

  // This stops the drag state from rapidly changing during drag
  // They also use this pattern in the dragDrop library
  let dragTimeout: ReturnType<typeof setTimeout> | undefined;
  const cleanupDragDrop = dragDrop(node, {
    async onDrop(files: File[]) {
      clearTimeout(dragTimeout);
      onDragStateChange(false);
      try {
        await processFiles(files, params);
      } catch (err) {
        onError(err, getErrorMessage(err));
      }
    },
    onDragOver() {
      clearTimeout(dragTimeout);
      onDragStateChange(true);
    },
    onDragLeave() {
      dragTimeout = setTimeout(() => {
        onDragStateChange(false);
      }, 50);
    },
  });

  return {
    destroy() {
      cleanupDragDrop();
    },
  };
}
