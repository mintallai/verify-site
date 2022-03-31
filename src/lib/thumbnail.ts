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

import type { HierarchyTreeNode } from '../stores';

export interface IThumbnailEvent {
  target: Node;
  url: string;
}

async function generateThumbnail(node, asset) {
  const result = await asset.getUrl();

  if (result) {
    node.dispatchEvent(
      new CustomEvent<IThumbnailEvent>('thumbnail', {
        detail: { target: node, url: result.data.url },
      }),
    );
  }

  return result;
}

function getAsset(treeNode: HierarchyTreeNode) {
  // FIXME: Needs to work for source
  return treeNode?.data.node.thumbnail;
}

export function thumbnail(node: Node, treeNode: HierarchyTreeNode) {
  let currTreeNode = treeNode;
  // TODO(@mensch): Add type of thumbnail object from SDK
  let currThumbnail;
  const asset = getAsset(treeNode);
  if (asset) {
    generateThumbnail(node, asset).then((result) => (currThumbnail = result));
  }

  return {
    async update(treeNode?: any) {
      if (treeNode) {
        // FIXME: Add back once hash functions are available to stop the flashes
        // const prevHash = await currTreeNode?.computeHash();
        // const currHash = await treeNode.computeHash();
        // if (prevHash !== currHash) {
        const result = await generateThumbnail(node, getAsset(treeNode));
        currThumbnail?.dispose?.();
        currThumbnail = result;
        currTreeNode = asset;
        // }
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
