<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
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
  import { _ } from 'svelte-i18n';
  import { resultsManifestStore, searchError } from '../stores';
  import BreadcrumbAsset from './BreadcrumbAsset.svelte';
  import CircleLoader from './CircleLoader.svelte';
  export let loadingMatches: boolean = false;
  export let handleButtonClick: (e: Event) => void;
</script>

{#if $searchError}
  <div class="font-bold text-gray-700 self-center ml-1 md:pt-[3.65rem]">
    {$_('comp.topNavigation.error')}
    <button on:click={handleButtonClick} class="underline text-blue-300"
      >{$_('comp.topNavigation.tryagain')}</button>
  </div>
{:else if loadingMatches}
  <div class="self-center ml-5 md:ml-1 md:pt-[3.3rem] pt-2 flex">
    <div><CircleLoader size="s" /></div>
    <div class="text-gray-900 ml-5 pt-1 md:pt-2">
      {$_('comp.topNavigation.searching')}
    </div>
  </div>
{:else if $resultsManifestStore}
  <div class="grid grid-rows-3 gap-0 pt-2 h-[92px]">
    <div class="flex">
      <div
        class="text-xs text-gray-700 self-center font-bold inline-block ml-1 ">
        {$_('comp.topNavigation.possibleMatches')}
      </div>
      <div class="self-center ml-2 inline-block">
        <cai-tooltip placement="bottom" class="theme-spectrum">
          <div
            slot="content"
            class="text-gray-900 z-auto text-sm justify-around "
            style="width: 220px;">
            {$_('comp.topNavigation.tooltip')}
          </div>
        </cai-tooltip>
      </div>
    </div>
    {#if $resultsManifestStore.length == 0}
      <div
        class="row-span-2 font-bold text-gray-700 self-baseline ml-1 pt-[1.35rem]">
        {$_('comp.topNavigation.noresult')}
      </div>
    {:else}
      <div
        class="flex row-span-2 ml-1 overflow-x-auto overflow-y-hidden h-[77px] w-full">
        {#each $resultsManifestStore as { }, i}
          <div class="mr-4">
            <BreadcrumbAsset value={i} />
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
