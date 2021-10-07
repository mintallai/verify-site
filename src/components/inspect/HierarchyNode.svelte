<script lang="ts">
  import equal from 'fast-deep-equal';
  import Thumbnail from '../Thumbnail.svelte';
  import ExpandHierarchy from '../../../assets/svg/monochrome/expand-hierarchy.svg';
  import {
    collapsedBranches,
    toggleBranch,
    primaryPath,
    compareWithPath,
    navigateToPath,
    isCompareSelectMode,
  } from '../../stores';
  import { getBadgeProps } from '../../lib/claim';
  import type { HierarchyNode } from 'd3-hierarchy';
  import type { ITreeNode } from '../../lib/types';

  export let node: HierarchyNode<ITreeNode>;

  $: data = node.data;
  $: children = node.children ?? [];
  $: hasChildren = children.length > 0;
  $: isExpanded = !$collapsedBranches.has(data.id);
  $: isSelected = equal($primaryPath, data.path);
  $: compare = $isCompareSelectMode && !isSelected;

  function handleClick() {
    if (compare) {
      compareWithPath(data.path);
    } else {
      navigateToPath(data.path);
    }
  }
</script>

<div class="container" class:compare>
  <div class="item">
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
    {#await data.asset.generateThumbnailUrl() then thumbnail}
      <div class="cursor-pointer w-12 h-12" on:click={handleClick}>
        <Thumbnail {thumbnail} {isSelected} {...getBadgeProps(data)} />
      </div>
    {/await}
    <div class="pl-3 cursor-pointer" on:click={handleClick}>
      <h6>File name</h6>
      <div>{data.name}</div>
    </div>
  </div>
  <div class="pl-6 space-y-5" class:hidden={!isExpanded}>
    {#each children as childNode (childNode.data.path.toString())}
      <svelte:self node={childNode} />
    {/each}
  </div>
</div>

<style lang="postcss">
  .container {
    @apply relative space-y-5 mb-1 transition duration-200 z-0;
  }
  .item {
    @apply grid items-center max-w-full bg-transparent transition-all duration-200 border-blue-500 border-r-0;
    grid-template-columns: 24px 48px auto;
    min-height: 0;
    min-width: 0;
  }
  .compare .item {
    @apply border-l-4;
  }
  .arrow {
    @apply transition transform -rotate-90 px-3 -ml-3;
  }
  .arrow.expanded {
    @apply rotate-0;
  }
</style>
