import { get } from 'svelte/store';
import dragDrop from 'drag-drop';
import { getSdk } from '../lib/sdk';
import { processFiles } from '../lib/file';
import { urlParams, provenance, setProvenance, setIsLoading } from '../stores';

interface ILoaderParams {
  onError: (error: any) => void;
  onLoaded: () => void;
  onDragStateChange: (isDragging: boolean) => void;
}

async function processSourceImage(sourceParam: string, params: ILoaderParams) {
  setIsLoading(true);
  try {
    const sdk = await getSdk();
    const result = await sdk.processImage(sourceParam);
    await window.newrelic?.setCustomAttribute('source', sourceParam);
    setProvenance(result);
    params.onLoaded();
  } catch (err) {
    console.error('Could not process file:', err);
    window.newrelic?.noticeError(err, {
      source: 'url',
    });
    params.onError(err);
  } finally {
    setIsLoading(false);
  }
}

export function loader(node, params: ILoaderParams) {
  const { onDragStateChange, onError } = params;
  const sourceParam = get(urlParams).source;

  if (sourceParam && !get(provenance)) {
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
        await processFiles(files);
      } catch (err) {
        onError(err);
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
