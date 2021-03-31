<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
    secondaryId,
    navigateToId,
  } from '../../stores';
  import { getBreadcrumbList } from '../../lib/claim';
  import '@spectrum-web-components/tabs/sp-tabs.js';
  import '@spectrum-web-components/tabs/sp-tab.js';
  import '@contentauth/web-components/dist/icons/monochrome/cai';
  import '@contentauth/web-components/dist/components/Tooltip';

  export let isComparing: boolean = false;
  const dispatch = createEventDispatcher();

  $: breadcrumbList = getBreadcrumbList($contentSourceIds, $assetsByIdentifier);
  $: homeId = breadcrumbList[0]?._id;
</script>

<div class="container">
  {#if isComparing}
    <div class="absolute flex cursor-pointer" on:click={() => dispatch('back')}>
      <Icon
        size="m"
        name="ui:ArrowLeftMedium"
        class="text-gray-800 mr-3 relative top-0.5"
      />
      <div class="breadcrumbs">
        <div class="breadcrumb-item font-bold">Back</div>
      </div>
    </div>
    <div class="compare-tabs">
      <sp-theme color="light" scale="medium">
        <sp-tabs selected="1">
          <sp-tab label="Split " value="1" />
          <sp-tab label="Slider" value="2" />
        </sp-tabs>
      </sp-theme>
    </div>
  {:else}
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
            <Icon size="s" name="workflow:ChevronRight" class="text-gray-800" />
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
  {/if}
</div>

<style lang="postcss">
  .container {
    @apply col-span-3 flex items-center border-b-2 border-gray-200 px-5 max-w-full relative;
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
    @apply inline-block relative;
    top: 2px;
  }
  .compare-tabs {
    @apply flex flex-grow justify-center;
    --spectrum-tabs-m-selection-indicator-color: var(--blue-500);
    --spectrum-tabs-m-rule-size: 4px;
  }
  .compare-tabs sp-tab {
    --spectrum-tabs-text-size: var(--font-size-100);
    --spectrum-tabs-text-font-weight: bold;
  }
</style>
