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

import { getThumbnail } from '../lib/node';
import type { Thumbnail } from 'c2pa';
import type { HierarchyTreeNode } from '../stores';

export interface ThumbnailEvent {
  target: Node;
  url: string;
}

async function generateThumbnail(node: Node, asset: Thumbnail) {
  const result = await asset?.getUrl();

  if (result) {
    node.dispatchEvent(
      new CustomEvent<ThumbnailEvent>('thumbnail', {
        detail: { target: node, url: result.url },
      }),
    );
  }

  return result;
}

export function thumbnail(node: Node, treeNode: HierarchyTreeNode) {
  let currTreeNode = treeNode;
  let currThumbnail: ReturnType<Thumbnail['getUrl']>;
  const asset = getThumbnail(treeNode);
  if (asset) {
    generateThumbnail(node, asset).then((result) => (currThumbnail = result));
  }

  return {
    async update(newTreeNode?: HierarchyTreeNode) {
      if (newTreeNode) {
        const prevHash = (await getThumbnail(currTreeNode)?.hash?.()) ?? 'prev';
        const currHash = (await getThumbnail(newTreeNode)?.hash?.()) ?? 'curr';
        if (prevHash !== currHash) {
          const result = await generateThumbnail(
            node,
            getThumbnail(newTreeNode),
          );
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
