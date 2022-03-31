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
  import Thumbnail from '../Thumbnail.svelte';
  import ExpandHierarchy from '../../../assets/svg/monochrome/expand-hierarchy.svg';
  import {
    collapsedBranches,
    toggleBranch,
    primaryId,
    compareWithPath,
    navigateTo,
    isCompareSelectMode,
  } from '../../stores';
  import { getBadgeProps, getPath } from '../../lib/claim';
  import type { HierarchyNode } from 'd3-hierarchy';
  import type { ITreeNode } from '../../lib/types';

  export let node: HierarchyNode<ITreeNode>;

  $: data = node.data;
  $: asset = data.asset;
  $: children = node.children ?? [];
  $: hasChildren = children.length > 0;
  $: isSingle = node.depth === 0 && !hasChildren;
  $: path = getPath(node);
  $: isExpanded = !$collapsedBranches.has(data.id);
  $: isSelected = equal($primaryId, path);
  $: compare = $isCompareSelectMode && !isSelected;
  $: badgeProps = getBadgeProps(data);

  function handleClick() {
    if (!isSelected) {
      if (compare) {
        compareWithPath(path);
      } else {
        navigateTo(path);
      }
    }
  }
</script>

<div class="container">
  <div
    class="item"
    class:single={isSingle}
    data-node-idx={data.locatorString}
    data-item-id={data.id.toString()}>
    {#if !isSingle}
      <div class="callout" class:compare />
      <div
        class="flex items-center justify-center h-full"
        class:cursor-pointer={hasChildren}
        on:click={() => hasChildren && toggleBranch(data.id)}>
        {#if hasChildren}
          <div class="arrow" class:expanded={isExpanded}>
            <ExpandHierarchy width="11" height="6" class="text-black" />
          </div>
        {/if}
      </div>
    {/if}
    <div
      class="w-12 h-12"
      class:cursor-pointer={!isSelected}
      on:click={handleClick}>
      <Thumbnail {asset} {isSelected} {...badgeProps} />
    </div>
    <div class="pl-3" class:cursor-pointer={!isSelected} on:click={handleClick}>
      <h6>{$_('comp.asset.fileName')}</h6>
      <div>{data.name}</div>
    </div>
  </div>
  <div class="pl-6 space-y-5" class:hidden={!isExpanded}>
    {#each children as childNode}
      <svelte:self node={childNode} />
    {/each}
  </div>
</div>

<style lang="postcss">
  .container {
    @apply space-y-5 mb-1 transition duration-200 z-0;
  }
  .item {
    @apply grid items-center max-w-full bg-transparent;
    grid-template-columns: 24px 48px auto;
    min-height: 0;
    min-width: 0;
  }
  .item.single {
    grid-template-columns: 48px auto;
  }
  .callout {
    @apply absolute left-0 w-0 h-12 bg-blue-500 transition-all duration-200;
  }
  .callout.compare {
    @apply w-1;
  }
  .arrow {
    @apply transition transform -rotate-90 px-3 -ml-3;
  }
  .arrow.expanded {
    @apply rotate-0;
  }
</style>
