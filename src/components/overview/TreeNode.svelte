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
  import { primaryLoc } from '../../stores';
  import Thumbnail from '../Thumbnail.svelte';
  import { getBadgeProps, isAncestorOf } from '../../lib/manifest';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import type { TreeNode } from '../../stores';

  export let node: HierarchyPointNode<TreeNode>;
  export let width: number;
  export let height: number;

  $: data = node.data;
  $: loc = node.data.loc;
  $: tx = node.x - width / 2;
  $: ty = node.y - height / 2;
  $: style = `width: ${width}px; height: ${height}px; transform: translate3d(${tx}px, ${ty}px, 0)`;
  $: isSelected = $primaryLoc === loc;
  $: isAncestor = !isSelected && isAncestorOf($primaryLoc, loc);
  $: badgeProps = getBadgeProps(node);
</script>

<div
  class="node"
  class:selected={isSelected}
  class:ancestor={isAncestor}
  data-node-idx={data.loc}
  {style}>
  <div class="content">
    <Thumbnail {node} {...badgeProps} />
    <div>
      <h6>{$_('comp.asset.fileName')}</h6>
      <div class="file-name">{node.data.title}</div>
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
