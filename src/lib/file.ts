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
    try {
      const result = await sdk.processImage(file);
      setProvenance(result);
    } catch (err) {
      console.error('Could not process file:', err);
      window.newrelic?.noticeError(err, {
        source: 'file',
        type: file.type,
      });
    } finally {
      setIsLoading(false);
    }
  }
}

export function loadFile() {
  processFiles(this.files);
}
