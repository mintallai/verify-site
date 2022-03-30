// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

// import { Asset, Source, IThumbnail } from './sdk';

export interface IThumbnailEvent {
  target: Node;
  url: string;
}

async function generateThumbnail(node, asset: Source) {
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
  let currAsset = asset;
  let currThumbnail: IThumbnail;
  if (asset) {
    generateThumbnail(node, asset).then((result) => (currThumbnail = result));
  }

  return {
    async update(asset?: Asset | Source) {
      if (asset) {
        const prevHash = await currAsset?.computeHash();
        const currHash = await asset.computeHash();
        if (prevHash !== currHash) {
          const result = await generateThumbnail(node, asset);
          currThumbnail?.dispose?.();
          currThumbnail = result;
          currAsset = asset;
        }
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
