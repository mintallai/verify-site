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
  import PopoverManifestRecov from './PopoverManifestRecov.svelte';
  import BreadcrumbAsset from './BreadcrumbAsset.svelte';
  import CircleLoader from './CircleLoader.svelte';
  import { resultsManifestStore, NoManifestsStore } from '../stores';
  export let loadingMatches: boolean = false;
  export let mobile: boolean = false;
</script>

{#if loadingMatches}
  <div class="self-center ml-5">
    <CircleLoader size="s" />
  </div>
{:else}
  {#if $NoManifestsStore}
    <div class="font-bold text-gray-700 self-center ml-5 ">
      No results found
    </div>
  {/if}
  {#if !mobile}
    {#each $resultsManifestStore as { manifestStore }, i}
      <div class="breadcrumb-item items-center current p-0 ml-5" />
      <BreadcrumbAsset value={i} />
    {/each}
  {:else}
    <div class="flex overflow-x-auto">
      {#each $resultsManifestStore as { manifestStore }, i}
        <BreadcrumbAsset value={i} />
      {/each}
    </div>
  {/if}
{/if}
