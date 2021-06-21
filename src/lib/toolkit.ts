import init, {
  get_summary_from_array_buffer,
} from '@contentauth/toolkit/pkg/web/toolkit';

// TODO: Update this with newrelic typescript defs
declare global {
  interface Window {
    newrelic: any;
  }
}

const JPEG_MIME_TYPE = /^image\/jpeg/;

let toolkit: any;

export enum ToolkitError {
  FetchError = 'FETCH_ERROR',
  InvalidFile = 'INVALID_FILE',
}

function fileAsArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    if (JPEG_MIME_TYPE.test(file.type)) {
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
  }
}

export async function getSummaryFromFile(file: File): Promise<ISummaryResult> {
  await loadToolkit();
  const arrayBuffer = await fileAsArrayBuffer(file);
  const summary = await get_summary_from_array_buffer(arrayBuffer, true);
  return {
    source: 'file',
    summary,
    file,
    arrayBuffer,
  };
}

export async function getSummaryFromUrl(url: string): Promise<ISummaryResult> {
  await loadToolkit();
  const res = await fetch(url);
  if (res.ok) {
    const contentType = res.headers.get('Content-Type');
    if (JPEG_MIME_TYPE.test(contentType)) {
      const arrayBuffer = await res.arrayBuffer();
      const summary = await get_summary_from_array_buffer(arrayBuffer, true);
      return {
        source: 'url',
        summary,
        url,
        arrayBuffer,
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
