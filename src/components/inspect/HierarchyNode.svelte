<script lang="ts">
  import Thumbnail from '../Thumbnail.svelte';
  import ExpandHierarchy from '../../../assets/svg/monochrome/expand-hierarchy.svg';
  import {
    collapsedBranches,
    toggleBranch,
    primaryId,
    compareWithId,
    navigateToPath,
  } from '../../stores';
  import type { HierarchyNode } from 'd3-hierarchy';
  import type { ITreeNode } from '../../lib/types';

  export let node: HierarchyNode<ITreeNode>;

  $: data = node.data;
  $: children = node.children ?? [];
  $: hasChildren = children.length > 0;
  $: isExpanded = !$collapsedBranches.has(data.id);
</script>

<div class="container">
  <div
    class="item"
    on:click={() => {
      console.log('data.path', data.path);
      navigateToPath(data.path);
    }}>
    <div class="flex items-center justify-center h-full">
      {#if hasChildren}
        <div
          class="arrow"
          class:expanded={isExpanded}
          on:click={() => toggleBranch(data.id)}>
          <div class="svg">
            <ExpandHierarchy width="13" height="8" class="text-black" />
          </div>
        </div>
      {/if}
    </div>
    {#await data.asset.generateThumbnailUrl() then thumbnail}
      <Thumbnail {thumbnail} --cai-thumbnail-size="48px" />
    {/await}
    <div class="pl-3">
      <h6>File name</h6>
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
    @apply relative space-y-5 mb-1 transition duration-200 z-0;
  }
  .item {
    @apply grid items-center max-w-full bg-transparent transition-all duration-200 border-blue-500 border-r-0 cursor-pointer;
    grid-template-columns: 24px 48px auto;
    min-height: 0;
    min-width: 0;
  }
  .compare .item {
    @apply border-r-4;
  }
  .arrow .svg {
    @apply transition transform -rotate-90 px-3 -ml-3;
  }
  .arrow.expanded .svg {
    @apply rotate-0;
  }
</style>
