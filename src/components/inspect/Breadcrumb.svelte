<script lang="ts">
  import Icon from '../Icon.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
    navigateToId,
  } from '../../stores';
  import { getBreadcrumbList } from '../../lib/claim';

  $: breadcrumbList = getBreadcrumbList($contentSourceIds, $assetsByIdentifier);
  $: homeId = breadcrumbList[0]?._id;
</script>

<div class="container">
  {#if homeId}
    <div class="home" on:click={() => navigateToId(homeId)}>
      <Icon size="s" name="Home" class="text-black" />
    </div>
  {/if}
  <div class="breadcrumbs">
    {#each breadcrumbList as asset, index (asset._id)}
      {#if index > 0}
        <div class="separator">
          <Icon size="s" name="ChevronRight" class="text-gray-700" />
        </div>
      {/if}
      <div
        class="breadcrumb-item"
        class:current={asset._id === $primaryId}
        on:click={() => navigateToId(asset._id)}
      >
        {asset.title}
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .container {
    @apply col-span-3 flex items-center border-b-2 border-gray-200 px-5 max-w-full;
    height: 60px;
  }
  .home {
    @apply mr-2 cursor-pointer;
  }
  .breadcrumbs {
    @apply text-sm;
  }
  .breadcrumb-item {
    @apply inline-block cursor-pointer;
  }
  .breadcrumb-item.current {
    @apply font-bold cursor-default;
  }
  .separator {
    @apply inline-block relative ml-1;
    top: 2px;
  }
</style>
