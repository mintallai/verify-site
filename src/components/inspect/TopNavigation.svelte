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
  import { createEventDispatcher } from 'svelte';
  import { locale, _ } from 'svelte-i18n';
  import { recoverManifests } from '$lib/manifest-recovery';
  import LeftArrow from '../../../assets/svg/monochrome/left-arrow.svg?component';
  import {
    compareMode,
    CompareMode,
    primaryLoc,
    resultsManifestStore,
    searchError,
    setCompareMode,
  } from '../../stores';
  import Button from '../Button.svelte';
  import ResultManifestsDisplay from '../ResultManifestsDisplay.svelte';
  import Tooltip from '../Tooltip.svelte';
  import UploadedAsset from '../UploadedAsset.svelte';

  import '@spectrum-web-components/menu/sp-menu-item.js';
  import '@spectrum-web-components/picker/sp-picker.js';

  export let isComparing: boolean = false;

  let loadingMatches: boolean = false;
  const dispatch = createEventDispatcher();

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
</script>

<div id="breadcrumb-bar" class="nav-container z-10">
  <sp-theme color="lightest" scale="medium" class="w-full">
    <!-- Only display Top Nav if there is an active asset -->
    {#if $primaryLoc}
      {#if isComparing}
        <div class="flex space-x-5 py-3">
          <button
            class="flex items-center cursor-pointer"
            on:click={() => dispatch('back')}>
            <LeftArrow width="14px" height="12px" class="text-gray-800 mr-2" />
            <div>
              {$_('comp.topNavigation.back')}
            </div>
          </button>
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
                    class="text-gray-900 z-50 text-sm justify-around w-[200px]">
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

  .nav-container > sp-theme {
    @apply flex items-stretch;
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
