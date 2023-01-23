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
  import ExpandHierarchy from '../../../assets/svg/monochrome/expand-hierarchy.svg?component';
  import { getBadgeProps, getFilename } from '$lib/node';
  import type { HierarchyTreeNode } from '../../stores';
  import {
    collapsedBranches,
    compareWith,
    isCompareSelectMode,
    navigateTo,
    primaryLoc,
    toggleBranch,
  } from '../../stores';
  import Thumbnail from '../Thumbnail.svelte';

  export let node: HierarchyTreeNode;

  $: data = node.data;
  $: loc = data.loc;
  $: children = node.children ?? [];
  $: hasChildren = children.length > 0;
  $: isSingle = node.depth === 0 && !hasChildren;
  $: isExpanded = !$collapsedBranches.has(loc);
  $: isSelected = $primaryLoc === loc;
  $: compare = $isCompareSelectMode && !isSelected;
  $: badgeProps = getBadgeProps(node);

  function handleClick() {
    if (!isSelected) {
      if (compare) {
        compareWith(loc);
      } else {
        navigateTo(loc);
      }
    }
  }
</script>

<div class="h-container">
  <div
    class="item"
    class:single={isSingle}
    data-node-idx={data.loc}
    data-item-id={data.loc}>
    {#if !isSingle}
      <div class="callout" class:compare />
      <button
        class="flex items-center justify-center h-full"
        class:cursor-pointer={hasChildren}
        on:click={() => hasChildren && toggleBranch(data.loc)}>
        {#if hasChildren}
          <div class="arrow" class:expanded={isExpanded}>
            <ExpandHierarchy width="11" height="6" class="text-black" />
          </div>
        {/if}
      </button>
    {/if}
    <button
      aria-labelledby={getFilename(node)}
      aria-selected={isSelected}
      class="w-12 h-12"
      class:cursor-pointer={!isSelected}
      on:click={handleClick}>
      <Thumbnail {node} {isSelected} {...badgeProps} />
    </button>
    <button
      class="pl-3 text-start"
      class:cursor-pointer={!isSelected}
      on:click={handleClick}>
      <h6>{$_('comp.asset.fileName')}</h6>
      <div>{getFilename(node)}</div>
    </button>
  </div>
  <div class="pl-6 space-y-5" class:hidden={!isExpanded}>
    {#each children as childNode}
      <svelte:self node={childNode} />
    {/each}
  </div>
</div>

<style lang="postcss">
  .h-container {
    @apply space-y-5 mb-1 transition duration-200 z-0;
    --cai-thumbnail-selected-shadow-spread: 2px;
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
