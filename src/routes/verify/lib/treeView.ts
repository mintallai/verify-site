// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

import { ROOT_ID, type AssetData } from '$src/lib/asset';
import { hierarchy as d3Hierarchy, tree as d3Tree } from 'd3-hierarchy';
import { select as d3Select } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom';
import partial from 'lodash/partial';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { ReadableAssetStore } from '../stores/asset';
import type { ReadableAssetMap } from '../stores/hierarchyView';

export interface TreeViewConfig {
  margin: number;
  nodeWidth: number;
  nodeHeight: number;
  hPad: number;
  vPad: number;
}

export interface ComponentDims {
  width: number;
  height: number;
}

export interface Transforms {
  tx: number;
  ty: number;
  scale: number;
  gTransform: string;
  htmlTransform: string;
  minScale: number;
}

const defaultConfig: TreeViewConfig = {
  margin: 0.95,
  hPad: 40,
  vPad: 50,
  nodeHeight: 100,
  nodeWidth: 100,
};

export interface CreateTreeViewProps {
  assetStoreMap: ReadableAssetMap;
  selectedAsset: Readable<AssetData>;
  config: Partial<TreeViewConfig>;
  svgElement: SVGElement;
  boundsElement: SVGGraphicsElement;
  dims: ComponentDims;
}

export function remToPx(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getMinScaleFromBounds(
  boundsElement: SVGGraphicsElement,
  margin: number,
  width: number,
  height: number,
) {
  const bbox = boundsElement.getBBox();

  if (bbox) {
    const xRatio = bbox.width / width;
    const yRatio = bbox.height / height;

    return Math.min(1, margin / Math.max(xRatio, yRatio));
  }

  return 1;
}

export function createTreeView({
  assetStoreMap,
  selectedAsset,
  config: initialConfig,
  svgElement,
  boundsElement,
  dims: initialDims,
}: CreateTreeViewProps) {
  const svgSel = d3Select<SVGElement, unknown>(svgElement);
  const boundsTransform = writable<ZoomTransform | null>(null);
  const dims = writable<ComponentDims>(initialDims);
  const { nodeWidth, nodeHeight, vPad, hPad, margin } = {
    ...defaultConfig,
    ...initialConfig,
  };
  const getMinScale = partial(getMinScaleFromBounds, boundsElement, margin);
  const zoom = d3Zoom<SVGElement, unknown>().on('zoom', (evt) =>
    boundsTransform.set(evt.transform),
  );
  const hierarchy = d3Hierarchy(assetStoreMap[ROOT_ID], (readableAsset) => {
    const assetData = get(readableAsset);
    const childrenIds = assetData.children;

    return childrenIds ? childrenIds.map((id) => assetStoreMap[id]) : [];
  });
  const d3tree = d3Tree<ReadableAssetStore>();
  d3tree.size([initialDims.width, initialDims.height]);
  d3tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
  d3tree.separation((a, b) => (a.parent == b.parent ? 1 : 1));
  const tree = d3tree(hierarchy);

  svgSel
    .call(zoom)
    // Initially center on the root
    .call(
      zoom.transform,
      zoomIdentity.translate(initialDims.width / 2, initialDims.height * 0.25),
    );

  const dimsUnsub = dims.subscribe(({ width, height }) => {
    const minScale = getMinScale(width, height);
    zoom.scaleExtent([minScale, 1]);
  });

  return {
    setDimensions(newDims: ComponentDims) {
      dims.set(newDims);
    },

    transforms: derived(
      [dims, boundsTransform],
      ([$dims, $boundsTransform]) => {
        const tx = $boundsTransform?.x ?? 0;
        const ty = $boundsTransform?.y ?? 0;
        const scale = $boundsTransform?.k ?? 0;

        return {
          tx,
          ty,
          scale,
          gTransform: `translate(${tx}, ${ty}) scale(${scale})`,
          htmlTransform: `translate3d(${tx}px, ${ty}px, 0) scale3d(${scale}, ${scale}, 1)`,
          minScale: getMinScale($dims.width, $dims.height),
        } as Transforms;
      },
    ),

    links: derived([selectedAsset], () => {
      return (
        tree
          .links()
          .map((link, idx) => {
            const { source, target } = link;
            const isAncestor =
              get(source.data).state !== 'none' &&
              get(target.data).state !== 'none';

            return { link, idx, isAncestor };
          })
          // Make sure the highlighted (ancestor) paths appear on top
          .sort((a, b) => {
            if (a.isAncestor && !b.isAncestor) {
              return 1;
            }

            if (!a.isAncestor && b.isAncestor) {
              return -1;
            }

            return 0;
          })
      );
    }),

    get descendants() {
      return tree.descendants();
    },

    zoomIn() {
      zoom.scaleTo(svgSel.transition(), 1);
    },

    zoomOut() {
      const sel = svgSel.transition();
      const bbox = boundsElement.getBBox();
      const { width, height } = get(dims);
      const minScaleZoom = getMinScale(width, height / 2);
      sel.call(
        zoom.transform,
        zoomIdentity
          .translate(width / 2, height / 2)
          .scale(minScaleZoom)
          .translate(
            -(bbox.x * 2 + bbox.width) / 2,
            -(bbox.y * 6 + bbox.height) / 2,
          ),
      );
    },

    destroy() {
      dimsUnsub();
      svgSel.on('.zoom', null);
    },
  };
}
