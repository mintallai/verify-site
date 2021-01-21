import { getSummaryFromFile } from '../lib/toolkit';
import { setSummary } from '../stores';

const VALID_TYPES = ['image/jpeg'];

export async function processFiles(files: File[] | FileList) {
  const validFiles = Array.from(files).filter((file) =>
    VALID_TYPES.includes(file.type),
  );
  if (validFiles.length) {
    setSummary(null);
    const data = await getSummaryFromFile(validFiles[0]);
    setSummary(data);
  }
}

export function loadFile() {
  processFiles(this.files);
}
