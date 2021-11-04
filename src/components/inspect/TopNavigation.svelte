<script lang="ts">
  import { goto, params, url } from '@roxi/routify';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import {
    primaryId,
    primaryPath,
    primaryAsset,
    ancestors,
    compareMode,
    setCompareMode,
    CompareMode,
    isMobileViewerShown,
    navigateToPath,
    hierarchy,
  } from '../../stores';
  import { Source } from '../../lib/sdk';
  import BreadcrumbDropdown from '../../../assets/svg/monochrome/breadcrumb-dropdown.svg';
  import ChevronRight from '../../../assets/svg/monochrome/chevron-right.svg';
  import LeftArrow from '../../../assets/svg/monochrome/left-arrow.svg';
  import '@contentauth/web-components/dist/icons/monochrome/cai';
  import '@contentauth/web-components/dist/components/Thumbnail';
  import '@contentauth/web-components/dist/components/Tooltip';
  import Thumbnail from '../Thumbnail.svelte';
  import { getPath } from '../../lib/claim';
  import equal from 'fast-deep-equal';

  type Page = 'overview' | 'inspect';

  export let currentPage: Page = 'overview';
  export let isComparing: boolean = false;
  export let noMetadata: boolean = false;
  export let source: Source | null = null;
  const dispatch = createEventDispatcher();

  function handleNavChange() {
    $goto(this.selected, $params);
  }

  function handleCompareChange() {
    setCompareMode(this.value);
  }

  $: showMenu = $isMobileViewerShown;
  $: nodeAncestors = $ancestors;
  $: thumbnailAsset =
    $primaryAsset instanceof Source ? $primaryAsset : $primaryAsset?.asset;
  $: thumbnailTitle =
    $primaryAsset instanceof Source
      ? $primaryAsset.filename
      : $primaryAsset?.title;
</script>

<div id="breadcrumb-bar" class="container" class:menu-view={showMenu}>
  <!-- Only display Top Nav if there is an active asset -->
  {#if $primaryId}
    <sp-theme color="lightest" scale="medium" class="w-full">
      {#if isComparing}
        <div class="flex space-x-5 py-3">
          <div
            class="flex items-center cursor-pointer"
            on:click={() => dispatch('back')}>
            <LeftArrow width="14px" height="12px" class="text-gray-800 mr-2" />
            <div>
              {$_('comp.topNavigation.back')}
            </div>
          </div>
          <div class="flex pl-5 items-center border-l border-gray-300">
            <sp-picker
              id="compare-picker"
              on:change={handleCompareChange}
              value={$compareMode}
              quiet
              size="m">
              <sp-menu-item value={CompareMode.Slider}>
                {$_('comp.topNavigation.slider')}
              </sp-menu-item>
              <sp-menu-item value={CompareMode.Split}>
                {$_('comp.topNavigation.split')}
              </sp-menu-item>
            </sp-picker>
          </div>
        </div>
      {:else if showMenu}
        <div class="flex self-center">
          {#if nodeAncestors?.length > 1}
            <sp-action-menu class="-ml-3" value={$primaryId}>
              <div slot="icon" class="py-2">
                <BreadcrumbDropdown
                  slot="icon"
                  width="20"
                  height="16"
                  class="breadcrumb-nav text-gray-800" />
              </div>
              {#each nodeAncestors.reverse() as parent (parent.data?.id)}
                <!-- neither this on:click or getPath produce the correct result for Gavin's deeply nested CICA image -->
                <sp-menu-item
                  selected={equal(getPath(parent), $primaryPath)}
                  on:click={navigateToPath(getPath(parent))}
                  value={parent.data?.id}>
                  <div class="flex items-center">
                    <Thumbnail slot="icon" asset={parent.data?.asset} />
                    <span class="ml-2 items-center">{parent.data?.name}</span>
                  </div>
                </sp-menu-item>
              {/each}
            </sp-action-menu>
            <div class="mx-2 flex items-center">
              <ChevronRight width="16px" height="16px" class="text-gray-700" />
            </div>
          {/if}
          <div class="breadcrumb-item items-center current">
            <Thumbnail asset={thumbnailAsset} />
            <span class="font-regular text-smd ml-2">{thumbnailTitle}</span>
          </div>
        </div>
      {:else}
        <sp-tabs
          selected={$url()}
          on:change={handleNavChange}
          class="nav-tabs mt-1 -ml-4">
          <sp-tab label={$_('comp.topNavigation.overview')} value="/overview" />
          <sp-tab label={$_('comp.topNavigation.inspect')} value="/inspect" />
        </sp-tabs>
      {/if}
    </sp-theme>
  {/if}
</div>

<style lang="postcss">
  .container {
    --spectrum-picker-m-text-color: var(--black);
    --spectrum-picker-m-text-color-hover: var(--black);
    --cai-thumbnail-size: 32px;
    @apply flex bg-white border-b-2 border-gray-200 px-5 max-w-full z-30 items-stretch;
    grid-area: breadcrumb;
    height: 60px;
  }
  .container > sp-theme {
    @apply flex items-stretch;
  }
  .breadcrumb-item {
    @apply flex cursor-pointer;
  }
  .breadcrumb-item.current {
    @apply font-bold cursor-default;
  }

  .breadcrumb-nav {
    --cai-thumbnail-size: 20px;
  }
  .nav-tabs {
    --spectrum-tabs-rule-color: var(--white);
    --spectrum-tabs-m-text-color: var(--gray-700);
    --spectrum-tabs-m-selection-indicator-color: var(--blue-500);
    --spectrum-tabs-m-rule-size: 4px;
    --spectrum-tabs-item-gap: 1.25rem;
  }
  .nav-tabs sp-tab {
    --spectrum-tabs-text-size: var(--font-size-100);
  }

  sp-menu-item {
    --cai-thumbnail-size: 32px;
  }

  @screen lgHeight {
    .container {
      @apply sticky;
      top: 80px;
    }
  }
</style>
