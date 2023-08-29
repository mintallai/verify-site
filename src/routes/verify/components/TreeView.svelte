<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->

<script context="module" lang="ts">
  export interface Link {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    active: boolean;
  }
</script>

<script lang="ts">
  import { ROOT_ID } from '$lib/asset';
  import { hierarchy as d3Hierarchy, tree as d3Tree } from 'd3-hierarchy';
  import { derived, get, type Readable } from 'svelte/store';
  import type { ReadableAssetData, ReadableAssetStore } from '../stores/asset';
  import type { ReadableAssetMap } from '../stores/hierarchyView';
  import TreeLink from './TreeLink.svelte';
  import TreeNode from './TreeNode.svelte';

  interface Node extends ReadableAssetData {
    x: number;
    y: number;
  }

  let width = 1;
  let height = 1;
  // let margin = 0.95;
  let nodeWidth = 294;
  let nodeHeight = 104;
  let hPad = 50;
  let vPad = 50;

  export let assetStoreMap: ReadableAssetMap;

  let linkStores: Readable<Link>[] = [];
  let assetStores: Readable<Node>[] = [];

  $: {
    const d3hierarchy = d3Hierarchy(assetStoreMap[ROOT_ID], (readableAsset) => {
      const assetData = get(readableAsset);
      const childrenIds = assetData.manifestData?.children;

      return childrenIds ? childrenIds.map((id) => assetStoreMap[id]) : [];
    });

    const d3tree = d3Tree<ReadableAssetStore>();
    d3tree.size([width, height]);
    d3tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
    const root = d3tree(d3hierarchy);

    assetStores = root.descendants().map((node) =>
      derived(node.data, ($nodeData) => ({
        x: node.x,
        y: node.y,
        ...$nodeData,
      })),
    );

    linkStores = root.links().map(({ source, target }) =>
      derived(
        target.data,
        ($targetData) =>
          ({
            x0: source.x,
            y0: source.y,
            x1: target.x,
            y1: target.y,
            active: $targetData.state !== 'none',
          } as Link),
      ),
    );
  }
</script>

{#each assetStores as assetStore}
  <TreeNode {assetStore} />
{/each}
{#each linkStores as linkStore}
  <TreeLink {linkStore} />
{/each}
