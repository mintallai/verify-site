import { Asset, Source, IThumbnail } from './sdk';

interface IThumbnailEvent {
  target: Node;
  url: string;
}

async function generateThumbnail(node, asset: Asset | Source) {
  let result;
  if (asset instanceof Asset) {
    result = await asset.generateThumbnailUrl();
  } else if (asset instanceof Source) {
    result = await asset.generateUrl();
  }
  if (result) {
    node.dispatchEvent(
      new CustomEvent<IThumbnailEvent>('thumbnail', {
        detail: { target: node, url: result.url },
      }),
    );
  }
  return result;
}

export function thumbnail(node: Node, asset?: Asset | Source) {
  let currThumbnail: IThumbnail;
  if (asset) {
    generateThumbnail(node, asset).then((result) => (currThumbnail = result));
  }

  return {
    update(asset?: Asset | Source) {
      if (asset) {
        generateThumbnail(node, asset).then((result) => {
          currThumbnail?.dispose?.();
          currThumbnail = result;
        });
      }
    },

    destroy() {
      currThumbnail?.dispose?.();
    },
  };
}

export function handleImgSrc(evt: CustomEvent<IThumbnailEvent>) {
  const { target, url } = evt.detail;
  (target as HTMLImageElement).src = url;
}
