import { getSummaryFromFile, ToolkitError } from '../lib/toolkit';
import { setSummary } from '../stores';

const VALID_TYPES = ['image/jpeg'];

export async function processFiles(files: File[] | FileList) {
  const fileArray = Array.from(files);
  const validFiles = fileArray.filter((file) =>
    VALID_TYPES.includes(file.type),
  );
  if (validFiles.length) {
    const file = validFiles[0];
    setSummary(null);
    window.newrelic?.addPageAction('loadedUserFile', {
      type: file.type,
    });
    const result = await getSummaryFromFile(file);
    setSummary(result);
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
