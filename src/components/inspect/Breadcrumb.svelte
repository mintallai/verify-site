<script lang="ts">
  import Icon from '../Icon.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
    navigateToId,
  } from '../../stores';
  import { getBreadcrumbList } from '../../lib/claim';
  import '@contentauth/web-components/dist/icons/monochrome/cai';
  import '@contentauth/web-components/dist/components/Tooltip';

  $: breadcrumbList = getBreadcrumbList($contentSourceIds, $assetsByIdentifier);
  $: homeId = breadcrumbList[0]?._id;
</script>

<div class="container">
  {#if homeId}
    <cai-tooltip class="theme-spectrum">
      <div class="home" slot="trigger" on:click={() => navigateToId(homeId)}>
        <cai-icon-cai />
      </div>
      <div slot="content">This is the content you started with.</div>
    </cai-tooltip>
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
    --cai-icon-width: 19px;
    --cai-icon-height: 16px;
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
