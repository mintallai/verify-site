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

import type { Thumbnail } from '../lib/sdk';
import type { HierarchyTreeNode } from '../stores';

export interface ThumbnailEvent {
  target: Node;
  url: string;
}

async function generateThumbnail(node: Node, asset: Thumbnail) {
  const result = await asset.getUrl();

  if (result) {
    node.dispatchEvent(
      new CustomEvent<ThumbnailEvent>('thumbnail', {
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
  let currThumbnail: ReturnType<Thumbnail['getUrl']>;
  const asset = getAsset(treeNode);
  if (asset) {
    generateThumbnail(node, asset).then((result) => (currThumbnail = result));
  }

  return {
    async update(newTreeNode?: HierarchyTreeNode) {
      console.log('currTreeNode, newTreeNode', currTreeNode, newTreeNode);
      if (newTreeNode) {
        const prevHash = await getAsset(currTreeNode).hash();
        const currHash = await getAsset(newTreeNode).hash();
        console.log('prevHash, currHash', prevHash, currHash);
        if (prevHash !== currHash) {
          const result = await generateThumbnail(node, getAsset(newTreeNode));
          currThumbnail?.dispose?.();
          currThumbnail = result;
          currTreeNode = newTreeNode;
        }
      }
    },

    destroy() {
      currThumbnail?.dispose?.();
    },
  };
}

export function handleImgSrc(evt: CustomEvent<ThumbnailEvent>) {
  const { target, url } = evt.detail;
  (target as HTMLImageElement).src = url;
}
