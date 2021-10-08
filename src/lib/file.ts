import { setIsLoading, setProvenance } from '../stores';
import { getSdk } from './sdk';

export async function processFiles(files: File[] | FileList) {
  const fileArray = Array.from(files);
  if (fileArray.length) {
    setIsLoading(true);
    const sdk = await getSdk();
    const file = fileArray[0];
    setProvenance(null);
    window.newrelic?.addPageAction('loadedUserFile', {
      type: file.type,
    });
    const result = await sdk.processImage(file);
    setProvenance(result);
    setIsLoading(false);
  }
}

export function loadFile() {
  processFiles(this.files);
}
