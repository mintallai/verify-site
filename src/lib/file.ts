import { setProvenance } from '../stores';
import { getSdk } from './sdk';

export async function processFiles(files: File[] | FileList) {
  const fileArray = Array.from(files);
  if (fileArray.length) {
    const sdk = await getSdk();
    const file = fileArray[0];
    setProvenance(null);
    window.newrelic?.addPageAction('loadedUserFile', {
      type: file.type,
    });
    const result = await sdk.processImage(file);
    setProvenance(result);
  }
}

export function loadFile() {
  processFiles(this.files);
}
