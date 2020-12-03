import init, {
  get_summary_from_array_buffer,
} from '@contentauth/toolkit/pkg/web/toolkit';

const JPEG_MIME_TYPE = 'image/jpeg';

let toolkit: any;

export enum WasmError {
  InvalidFile = 'INVALID_FILE',
}

function fileAsArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    if (file.type === JPEG_MIME_TYPE) {
      const reader = new FileReader();
      reader.addEventListener('load', (evt: any) => {
        resolve(new Uint8Array(evt.target.result));
      });
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error(WasmError.InvalidFile));
    }
  });
}

async function loadToolkit() {
  if (!toolkit) {
    const res = await fetch(`__toolkit_wasm_src__`);
    const buf = await res.arrayBuffer();
    toolkit = await init(buf);
    console.debug('Loaded CAI toolkit');
  }
}

export async function getSummaryFromFile(
  file: File,
): Promise<ISummaryResponse> {
  await loadToolkit();
  const arrayBuffer = await fileAsArrayBuffer(file);
  return get_summary_from_array_buffer(arrayBuffer, false);
}

export async function getSummaryFromUrl(
  url: string,
): Promise<ISummaryResponse> {
  await loadToolkit();
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return get_summary_from_array_buffer(arrayBuffer, false);
}
