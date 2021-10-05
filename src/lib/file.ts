import { isValidMimeType, ToolkitError } from '../lib/toolkit';
import { setProvenance } from '../stores';
import { getSdk } from './sdk';

export async function processFiles(files: File[] | FileList) {
  const fileArray = Array.from(files);
  const validFiles = fileArray.filter((file) => isValidMimeType(file.type));
  if (validFiles.length) {
    const sdk = await getSdk();
    const file = validFiles[0];
    setProvenance(null);
    window.newrelic?.addPageAction('loadedUserFile', {
      type: file.type,
    });
    const result = await sdk.processImage(file);
    setProvenance(result);
  } else if (fileArray.length) {
    const invalidTypeError = new Error(ToolkitError.InvalidFile);
    window.newrelic?.noticeError(invalidTypeError, {
      type: fileArray[0]?.type,
    });
    throw invalidTypeError;
  }
}

export function loadFile() {
  processFiles(this.files);
}
