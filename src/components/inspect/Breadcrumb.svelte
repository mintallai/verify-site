<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Icon from '../Icon.svelte';
  import {
    contentSourceIds,
    storeReport,
    primaryId,
    primaryAsset,
    navigateToId,
    compareMode,
    setCompareMode,
    CompareMode,
    isMobileViewerShown,
  } from '../../stores';
  import {
    getBreadcrumbList,
    getThumbnailUrlForId,
    getTitle,
  } from '../../lib/claim';
  import BreadcrumbDropdown from '../../../assets/svg/monochrome/breadcrumb-dropdown.svg';
  import LeftArrow from '../../../assets/svg/monochrome/left-arrow.svg';
  import '@spectrum-web-components/tabs/sp-tabs.js';
  import '@spectrum-web-components/tabs/sp-tab.js';
  import '@contentauth/web-components/dist/icons/monochrome/cai';
  import '@contentauth/web-components/dist/components/Thumbnail';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@spectrum-web-components/action-menu/sp-action-menu.js';
  import '@spectrum-web-components/menu/sp-menu.js';
  import '@spectrum-web-components/menu/sp-menu-item.js';

  export let isComparing: boolean = false;
  export let noMetadata: boolean = false;
  export let source: ISourceInfo | null = null;
  const dispatch = createEventDispatcher();

  function handleCompareChange() {
    setCompareMode(this.selected);
  }

  function handleMenuChange() {
    navigateToId(this.value);
  }

  $: breadcrumbList = getBreadcrumbList($storeReport, $contentSourceIds);
  $: homeId = breadcrumbList[0]?.id;
  $: showMenu =
    breadcrumbList.length > 1 &&
    ($isMobileViewerShown || breadcrumbList.length > 4);
</script>

<div id="breadcrumb-bar" class="container" class:menu-view={showMenu}>
  {#if isComparing}
    <div
      class="absolute flex items-center cursor-pointer"
      on:click={() => dispatch('back')}
    >
      <LeftArrow width="14px" height="12px" class="text-gray-800 mr-3" />
      <div class="breadcrumbs">
        <div class="breadcrumb-item font-bold">
          {$_('comp.breadcrumb.back')}
        </div>
      </div>
    </div>
    <div class="compare-tabs">
      <sp-theme color="light" scale="medium">
        <sp-tabs selected={$compareMode} on:change={handleCompareChange}>
          <sp-tab
            label={$_('comp.breadcrumb.split')}
            value={CompareMode.Split} />
          <sp-tab
            label={$_('comp.breadcrumb.slider')}
            value={CompareMode.Slider} />
        </sp-tabs>
      </sp-theme>
    </div>
  {:else if showMenu}
    <sp-theme color="light" scale="medium">
      <sp-action-menu
        class="-ml-3"
        value={$primaryId}
        on:change={handleMenuChange}>
        <div slot="icon" class="py-2">
          <BreadcrumbDropdown
            slot="icon"
            width="20"
            height="16"
            class="text-gray-800" />
        </div>
        {#each breadcrumbList as asset, _ ({ id: asset.id, ctx: 'menu-item' })}
          <sp-menu-item value={asset.id} class="checkbox-pos">
            <div class="menu-item pointer-events-none">
              <cai-thumbnail
                src={getThumbnailUrlForId($storeReport, asset.id)}
                class="theme-spectrum" />
              <div class="ml-2 text-100">{getTitle(asset)}</div>
            </div>
          </sp-menu-item>
        {/each}
      </sp-action-menu>
    </sp-theme>
    <div class="separator -ml-2">
      <Icon size="s" name="ChevronRight" class="text-gray-800" />
    </div>
    <div class="breadcrumb-item" class:current={true}>
      {getTitle($primaryAsset)}
    </div>
  {:else if homeId || noMetadata}
    {#if noMetadata && source}
      <div class="breadcrumb-item" class:current={true}>
        {source.name}
      </div>
    {:else if breadcrumbList}
      {#each breadcrumbList as asset, index ({ id: asset.id, ctx: 'breadcrumb-list' })}
        {#if index > 0}
          <div class="separator">
            <Icon size="s" name="ChevronRight" class="text-gray-800" />
          </div>
        {/if}
        <div
          class="breadcrumb-item hover:underline"
          class:current={asset.id === $primaryId}
          on:click={() => navigateToId(asset.id)}>
          {getTitle(asset)}
        </div>
      {/each}
    {/if}
  {/if}
</div>

<style lang="postcss">
  .container {
    @apply flex items-center bg-white border-b-2 border-gray-200 px-5 max-w-full z-30;
    grid-area: breadcrumb;
    height: 60px;
  }
  .breadcrumb-item {
    @apply inline-block cursor-pointer;
  }
  .breadcrumb-item.current {
    @apply font-bold cursor-default;
  }
  .separator {
    @apply inline-block relative px-2;
  }
  .menu-item {
    @apply flex items-center;
    --cai-thumbnail-size: 32px;
  }
  .checkbox-pos {
    --spectrum-listitem-icon-margin-top: 8px;
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
  @screen lgHeight {
    .container {
      @apply sticky;
      top: 80px;
    }
  }
</style>
