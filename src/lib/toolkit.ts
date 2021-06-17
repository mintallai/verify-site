import init, {
  get_store_report_from_array_buffer,
} from '@contentauth/toolkit/pkg/web/toolkit';
import startsWith from 'lodash/startsWith';
import { IStoreReportResult } from './types';
import debug from 'debug';

const dbg = debug('toolkit');

// TODO: Update this with newrelic typescript defs
declare global {
  interface Window {
    newrelic: any;
  }
}

const VALID_MIME_TYPES = ['image/jpeg', 'image/png'];

// Need to do this since some Content-Types are coming in such as
// `image/jpeg; charset=utf-8`
export function isValidMimeType(type: string) {
  return VALID_MIME_TYPES.some((mime) => startsWith(type, mime));
}

let toolkit: any;

export enum ToolkitError {
  FetchError = 'FETCH_ERROR',
  InvalidFile = 'INVALID_FILE',
}

function fileAsArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    if (isValidMimeType(file.type)) {
      const reader = new FileReader();
      reader.addEventListener('load', (evt: any) => {
        resolve(new Uint8Array(evt.target.result));
      });
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error(ToolkitError.InvalidFile));
    }
  });
}

async function loadToolkit() {
  if (!toolkit) {
    const res = await fetch(`__toolkit_wasm_src__`);
    const buf = await res.arrayBuffer();
    toolkit = await init(buf);
    dbg('Loaded CAI toolkit');
  }
}

function validateStoreReport(result) {
  if (result.head) {
    return result;
  }
  // No claim
  return false;
}

export async function getStoreReportFromFile(
  file: File,
): Promise<IStoreReportResult> {
  await loadToolkit();
  const arrayBuffer = await fileAsArrayBuffer(file);
  const storeReport = await get_store_report_from_array_buffer(arrayBuffer);
  dbg('getStoreReportFromFile file:', file, 'toolkit reponse:', storeReport);
  return {
    source: 'file',
    storeReport: validateStoreReport(storeReport),
    filename: file.name,
    data: new Blob([arrayBuffer], { type: file.type }),
  };
}

export async function getStoreReportFromUrl(
  url: string,
): Promise<IStoreReportResult> {
  await loadToolkit();
  const res = await fetch(url);
  if (res.ok) {
    const contentType = res.headers.get('Content-Type');
    if (isValidMimeType(contentType)) {
      const arrayBuffer = await res.arrayBuffer();
      const storeReport = await get_store_report_from_array_buffer(arrayBuffer);
      dbg('getStoreReportFromUrl url:', url, 'toolkit reponse:', storeReport);
      const { pathname } = new URL(url);
      const filename = pathname?.split('/').pop() || 'Unknown';
      return {
        source: 'url',
        storeReport: validateStoreReport(storeReport),
        filename,
        data: new Blob([arrayBuffer], { type: contentType }),
      };
    }
    const invalidFileError = new Error(ToolkitError.InvalidFile);
    window.newrelic?.noticeError(invalidFileError, { url, contentType });
    throw invalidFileError;
  }
  const fetchError = new Error(ToolkitError.FetchError);
  window.newrelic?.noticeError(fetchError, {
    url,
    status: res.status,
    statusText: res.statusText,
  });
  throw fetchError;
}
