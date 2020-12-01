import { css } from '@emotion/css';
import PQueue from 'p-queue';
import init, {
  get_summary_from_array_buffer,
} from '@contentauth/toolkit/pkg/web/toolkit';
import '@contentauth/web-components/dist/ImageInfo';

type ImageInfoElement = HTMLElement & {
  summary: any;
  href: string;
};

const queue: PQueue = new PQueue({ concurrency: 1 });

let toolkit: any;

const queryNode = document.createElement('a');
queryNode.href = import.meta['url'];
const moduleBase = queryNode.origin;

async function load() {
  if (!toolkit) {
    const res = await fetch(`${moduleBase}/pkg/toolkit_bg.wasm`);
    const buf = await res.arrayBuffer();
    toolkit = await init(buf);
    console.debug('Loaded CAI toolkit', toolkit);
  }
}

async function getClaimSummary(img: HTMLImageElement, source: string) {
  const res = await fetch(source);
  const buf = await res.arrayBuffer();
  await load();
  return queue.add(() => get_summary_from_array_buffer(buf, false));
}

function wrapImage(img: HTMLImageElement, wrapper: HTMLElement) {
  const fig = img.closest('figure');
  const figParent = fig.parentElement;
  figParent.insertBefore(wrapper, fig);
  wrapper.appendChild(fig);
}

const wrapperStyle = css`
  position: relative;
`;

const imageInfoStyle = css`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 9999;
`;

async function decorateImage(img: HTMLImageElement, source: string) {
  const wrapper = document.createElement('div');
  const summary = await getClaimSummary(img, source);
  wrapImage(img, wrapper);
  wrapper.classList.add(wrapperStyle);

  if (summary) {
    const imageInfo = document.createElement('image-info') as ImageInfoElement;
    const params = new URLSearchParams();
    params.append('callout', 'anchor');
    params.append('src', source);
    imageInfo.summary = summary;
    imageInfo.href = `${moduleBase}/inspect?${params.toString()}`;
    imageInfo.classList.add(imageInfoStyle);
    wrapper.append(imageInfo);
  }
}

async function swapImage(img: HTMLImageElement) {
  const newSrc = img.alt.replace(/^cai:\/\//, `${moduleBase}/static/`);
  console.debug('Overwriting %s with %s', img.src, newSrc);
  img.src = newSrc;
  decorateImage(img, newSrc);
  const callback: MutationCallback = (mutList, obs) => {
    // eslint-disable-next-line no-restricted-syntax
    if (mutList.some((x) => x.type === 'attributes')) {
      if (img.classList.contains('loaded')) {
        // Make sure we keep the src the same if it tries to get overwritten
        img.src = newSrc;
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
