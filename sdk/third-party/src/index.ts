import { css } from '@emotion/css';
import init, {
  get_summary_from_array_buffer,
} from '@contentauth/toolkit/pkg/web/toolkit';

let toolkit: any;

async function load() {
  if (!toolkit) {
    const res = await fetch(`__MODULE_BASE__/pkg/toolkit_bg.wasm`);
    const buf = await res.arrayBuffer();
    toolkit = await init(buf);
    console.debug('Loaded CAI toolkit', toolkit);
  }
}

async function getClaimSummary(img: HTMLImageElement, source: string) {
  const res = await fetch(source);
  const buf = await res.arrayBuffer();
  await load();
  const summary = await get_summary_from_array_buffer(buf, false);
  console.log('summary', summary);
}

function wrapImage(img: HTMLImageElement, wrapper: HTMLElement) {
  const fig = img.closest('figure');
  const figParent = fig.parentElement;
  figParent.insertBefore(wrapper, fig);
  wrapper.appendChild(fig);
}

const wrapperStyle = css`
  border: solid 4px blue;
`;

async function decorateImage(img: HTMLImageElement, source: string) {
  const wrapper = document.createElement('div');
  const summary = await getClaimSummary(img, source);
  wrapImage(img, wrapper);
  wrapper.classList.add(wrapperStyle);
  console.log('wrapper', wrapper);
}

async function swapImage(img: HTMLImageElement) {
  const newSrc = img.alt.replace(/^cai:\/\//, `__MODULE_BASE__/static/`);
  const callback: MutationCallback = (mutList, obs) => {
    // eslint-disable-next-line no-restricted-syntax
    if (mutList.some((x) => x.type === 'attributes')) {
      if (img.classList.contains('loaded')) {
        console.debug('Overwriting %s with %s', img.src, newSrc);
        img.src = newSrc;
        decorateImage(img, newSrc);
        obs.disconnect();
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(img, { attributes: true });
}

function decorateImages() {
  document
    .querySelectorAll(`img[alt^="cai://"]`)
    .forEach((img) => swapImage(img as HTMLImageElement));
}

document.addEventListener('DOMContentLoaded', async (event) => {
  decorateImages();
});

load();
