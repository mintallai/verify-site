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
import { getSdk } from '../lib/sdk';
import {
  urlParams,
  provenance,
  setProvenance,
  setIsLoading,
  lastUrlSource,
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

async function processSourceImage(sourceParam: string, params: ILoaderParams) {
  setIsLoading(true);
  try {
    const sdk = await getSdk();
    const result = await sdk.processImage(sourceParam);
    await window.newrelic?.setCustomAttribute('source', sourceParam);
    setProvenance(result);
    lastUrlSource.set(sourceParam);
    params.onLoaded();
  } catch (err) {
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
  if (fileArray.length) {
    setIsLoading(true);
    const sdk = await getSdk();
    const file = fileArray[0];
    setProvenance(null);
    window.newrelic?.addPageAction('loadedUserFile', {
      type: file.type,
    });
    try {
      const result = await sdk.processImage(file);
      setProvenance(result);
    } catch (err) {
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
