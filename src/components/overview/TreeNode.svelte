<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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

<script lang="ts">
  import { _ } from 'svelte-i18n';
  import equal from 'fast-deep-equal';
  import { primaryPath } from '../../stores';
  import Thumbnail from '../Thumbnail.svelte';
  import { getBadgeProps, getPath, isInPath } from '../../lib/claim';
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  export let node: HierarchyPointNode<ITreeNode>;
  export let width: number;
  export let height: number;

  $: data = node.data;
  $: tx = node.x - width / 2;
  $: ty = node.y - height / 2;
  $: style = `width: ${width}px; height: ${height}px; transform: translate3d(${tx}px, ${ty}px, 0)`;
  $: path = getPath(node);
  $: isSelected = equal($primaryPath, path);
  $: isAncestor = !isSelected && isInPath($primaryPath, path);
  $: badgeProps = getBadgeProps({
    claim: node.data.claim,
    errors: node.data.errors,
  });
</script>

<div
  class="node"
  class:selected={isSelected}
  class:ancestor={isAncestor}
  data-node-idx={data.locatorString}
  {style}>
  <div class="content">
    <Thumbnail asset={node.data.asset} {...badgeProps} />
    <div>
      <h6>{$_('comp.asset.fileName')}</h6>
      <div class="file-name">{node.data.name}</div>
    </div>
  </div>
</div>

<style lang="postcss">
  .node {
    @apply absolute top-0 left-0 bg-white border-2 border-gray-400 transition rounded-md;
  }
  .node.selected {
    @apply border-blue;
    stroke-width: 3px;
  }
  .node.ancestor {
    @apply border-gray-800;
  }
  .content {
    @apply grid gap-x-2 items-center w-full h-full p-2.5 bg-transparent cursor-pointer;
    grid-template-columns: 80px auto;
    --cai-thumbnail-size: 80px;
    --cai-thumbnail-badge-icon-width: 20px;
    --cai-thumbnail-badge-icon-height: 20px;
  }
  .file-name {
    @apply truncate;
    width: 185px;
  }
</style>
