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
  import { _, locale } from 'svelte-i18n';
  import { recoverManifests } from '../../lib/manifest-recovery';

  import {
    primaryLoc,
    ancestors,
    compareMode,
    setCompareMode,
    CompareMode,
    isMobileViewerShown,
    navigateTo,
    resultsManifestStore,
  } from '../../stores';
  import type { HierarchyTreeNode } from '../../stores';
  import BreadcrumbDropdown from '../../../assets/svg/monochrome/breadcrumb-dropdown.svg';
  import ChevronRight from '../../../assets/svg/monochrome/chevron-right.svg';
  import LeftArrow from '../../../assets/svg/monochrome/left-arrow.svg';
  import Thumbnail from '../Thumbnail.svelte';
  import { getFilename } from '../../lib/node';
  import '@contentauth/web-components/dist/icons/monochrome/cai';
  import '@contentauth/web-components/dist/components/Thumbnail';
  import '@contentauth/web-components/dist/components/Tooltip';
  import UploadedAsset from '../UploadedAsset.svelte';
  import ResultManifestsDisplay from '../ResultManifestsDisplay.svelte';

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
    const matchesManifests = await recoverManifests();
    loadingMatches = false;
    sortMatches(matchesManifests);
    if (Array.isArray(matchesManifests)) {
      resultsManifestStore.set(matchesManifests);
    }
  }

  export function selectDate(node) {
    return node.manifestStore.activeManifest.signatureInfo.time;
  }
  function sortMatches(matches) {
    let sortedMatches = matches.sort((n1, n2) => {
      if (selectDate(n1) > selectDate(n2)) {
        return 1;
      }

      if (selectDate(n1) < selectDate(n2)) {
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
  class="container"
  class:menu-view={$isMobileViewerShown}>
  <!-- Only display Top Nav if there is an active asset -->
  {#if $primaryLoc}
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
          <div class="grid grid-rows-2">
            <div class="flex">
              <UploadedAsset />
            </div>
            <div class="flex ">
              <div class="match-btn self-center ">
                <sp-button size="s" onclick={handleButtonClick}>
                  {$_('comp.topNavigation.matches')}
                </sp-button>
              </div>
              <ResultManifestsDisplay {loadingMatches} />
            </div>
          </div>
        </div>
      {:else}
        <UploadedAsset />
        <div class="match-btn self-center ml-5">
          <sp-button size="s" onclick={handleButtonClick}>
            {$_('comp.topNavigation.matches')}
          </sp-button>
        </div>
        <div class="self-center ml-5">
          <cai-tooltip placement="right" class="theme-spectrum">
            <div
              slot="content"
              class="text-gray-900 z-50"
              style="width: 200px;">
              {$_('comp.topNavigation.tooltip')}
            </div>
          </cai-tooltip>
        </div>
        <ResultManifestsDisplay {loadingMatches} />
      {/if}
    </sp-theme>
  {/if}
</div>

<style lang="postcss">
  .container {
    --spectrum-picker-m-text-color: var(--black);
    --spectrum-picker-m-text-color-hover: var(--black);
    --cai-thumbnail-size: 48px;
    @apply flex bg-white border-b-2 border-gray-200 px-5 max-w-full z-30 items-stretch;
    grid-area: breadcrumb;
    height: 60px;
  }
  .match-btn > sp-button {
    @apply w-fit h-[34px] text-gray-700 bg-gray-100;
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
  .menu-view {
    /* @apply grid grid-rows-2; */
    height: 120px;
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
    .container {
      @apply sticky;
      top: 80px;
    }
  }
</style>
