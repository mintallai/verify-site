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
  import { goto, params, url } from '@roxi/routify';
  import { createEventDispatcher } from 'svelte';
  import { locale, _ } from 'svelte-i18n';
  import BreadcrumbDropdown from '../../../assets/svg/monochrome/breadcrumb-dropdown.svg';
  import ChevronRight from '../../../assets/svg/monochrome/chevron-right.svg';
  import LeftArrow from '../../../assets/svg/monochrome/left-arrow.svg';
  import { recoverManifests } from '../../lib/manifest-recovery';
  import { getFilename } from '../../lib/node';
  import type { HierarchyTreeNode } from '../../stores';
  import {
    ancestors,
    compareMode,
    CompareMode,
    isMobileViewerShown,
    navigateTo,
    primaryLoc,
    resultsManifestStore,
    searchError,
    setCompareMode,
  } from '../../stores';
  import Button from '../Button.svelte';
  import ResultManifestsDisplay from '../ResultManifestsDisplay.svelte';
  import Thumbnail from '../Thumbnail.svelte';
  import Tooltip from '../Tooltip.svelte';
  import UploadedAsset from '../UploadedAsset.svelte';

  type Page = 'overview' | 'inspect';

  export let node: HierarchyTreeNode;
  export let currentPage: Page = 'overview';
  export let isComparing: boolean = false;
  export let noMetadata: boolean = false;
  let loadingMatches: boolean = false;
  const dispatch = createEventDispatcher();

  function handleNavChange() {
    $goto(this.selected, $params);
  }

  function handleCompareChange() {
    setCompareMode(this.value);
  }

  async function handleButtonClick() {
    loadingMatches = true;
    searchError.set(false);
    try {
      const matchesManifests = await recoverManifests();
      if (Array.isArray(matchesManifests)) {
        resultsManifestStore.set(matchesManifests);
      }
    } catch (err) {
      loadingMatches = false;
    }

    loadingMatches = false;
  }

  function selectDate(node) {
    return node.manifestStore.activeManifest.signatureInfo.time;
  }
  function sortMatches(matches) {
    const sortedMatches = matches.sort((n1, n2) => {
      const date1 = selectDate(n1);
      const date2 = selectDate(n2);

      if (date1 > date2) {
        return 1;
      }
      if (date1 < date2) {
        return -1;
      }

      return 0;
    });
    return sortedMatches;
  }
  $: nodeAncestors = $ancestors;
</script>

<div
  id="breadcrumb-bar"
  class="nav-container z-10"
  class:menu-view={$isMobileViewerShown}>
  <sp-theme color="lightest" scale="medium" class="w-full">
    <!-- Only display Top Nav if there is an active asset -->
    {#if $primaryLoc}
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
            {#key $locale}
              <sp-picker
                id="compare-picker"
                on:change={handleCompareChange}
                quiet
                value={$compareMode}
                size="m">
                <sp-menu-item value={CompareMode.Slider}>
                  {$_('comp.topNavigation.slider')}
                </sp-menu-item>
                <sp-menu-item value={CompareMode.Split}>
                  {$_('comp.topNavigation.split')}
                </sp-menu-item>
              </sp-picker>
            {/key}
          </div>
        </div>
      {:else if $isMobileViewerShown}
        <div class="flex self-center">
          {#if nodeAncestors?.length > 1}
            <sp-action-menu class="-ml-3" value={$primaryLoc}>
              <div slot="icon" class="py-2">
                <BreadcrumbDropdown
                  slot="icon"
                  width="20"
                  height="16"
                  class="breadcrumb-nav text-gray-800" />
              </div>
              {#each nodeAncestors.reverse() as parent (parent.data?.loc)}
                <sp-menu-item
                  selected={$primaryLoc === parent.data.loc}
                  on:click={navigateTo(parent.data.loc)}
                  value={parent.data?.loc}>
                  <div class="flex items-center">
                    <Thumbnail slot="icon" node={parent} />
                    <span class="ml-2 items-center">{getFilename(parent)}</span>
                  </div>
                </sp-menu-item>
              {/each}
            </sp-action-menu>
            <div class="mx-2 flex items-center">
              <ChevronRight width="16px" height="16px" class="text-gray-700" />
            </div>
          {/if}
          <div class="flex w-full">
            <div>
              <UploadedAsset />
            </div>
            <div class="flex w-full">
              {#if $resultsManifestStore || loadingMatches || $searchError}
                <div class="overflow-x-auto overflow-y-hidden">
                  <ResultManifestsDisplay
                    {loadingMatches}
                    {handleButtonClick} />
                </div>
              {:else}
                <div class="self-center ">
                  <Button secondary size="s" on:click={handleButtonClick}>
                    {$_('comp.topNavigation.matches')}
                  </Button>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="flex w-full">
          <div class="pr-12"><UploadedAsset /></div>
          {#if $resultsManifestStore || loadingMatches || $searchError}
            <div class="flex-auto ">
              <ResultManifestsDisplay {loadingMatches} {handleButtonClick} />
            </div>
          {:else}
            <div class="flex pt-6">
              <div class="self-center inline-block">
                <Button secondary size="s" on:click={handleButtonClick}>
                  {$_('comp.topNavigation.matches')}
                </Button>
              </div>
              <div class="self-center ml-5 inline-block">
                <Tooltip placement="right">
                  <div
                    slot="content"
                    class="text-gray-900 z-50 text-sm justify-around"
                    style="width: 220px;">
                    {$_('comp.topNavigation.tooltip')}
                  </div></Tooltip>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </sp-theme>
</div>

<style lang="postcss">
  .nav-container {
    --spectrum-picker-m-text-color: var(--black);
    --spectrum-picker-m-text-color-hover: var(--black);
    --cai-thumbnail-size: 48px;
    @apply flex bg-white border-b-2 border-gray-200 px-5 max-w-full items-stretch;
    grid-area: breadcrumb;
    height: 114px;
  }
  .match-btn > sp-button {
    @apply w-fit h-[34px] text-gray-700 bg-gray-100 rounded-full;
  }

  .nav-container > sp-theme {
    @apply flex items-stretch;
  }
  .breadcrumb-item {
    @apply flex cursor-pointer;
  }
  .breadcrumb-item.current {
    @apply font-bold cursor-default;
  }
  .menu-view {
    /* @apply grid grid-rows-2; */
    height: 114px;
  }
  .breadcrumb-nav {
    --cai-thumbnail-size: 20px;
  }

  .nav-tabs {
    --spectrum-tabs-rule-color: var(--white);
    --spectrum-tabs-m-text-color: var(--gray-700);
    --spectrum-tabs-m-selection-indicator-color: var(--blue-500);
    --spectrum-tabs-rule-border-radius: 0;
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
    .nav-container {
      @apply sticky;
    }
  }
</style>
