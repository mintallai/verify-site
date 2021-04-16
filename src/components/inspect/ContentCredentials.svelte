<script lang="ts">
  import Asset from './Asset.svelte';
  import Button from '../Button.svelte';
  import OriginalCreation from './OriginalCreation.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
  } from '../../stores';
  import { getAssetList, getBreadcrumbList } from '../../lib/claim';
  import { isSecureCapture } from '../../lib/demo';

  export let claim: IClaimSummary | null = null;
  export let source: ISourceInfo | null = null;
  let container: any;
  let isCompareMode = false;

  $: assetList = claim ? getAssetList(claim, $assetsByIdentifier) : [];
  $: breadcrumbList = getBreadcrumbList($contentSourceIds, $assetsByIdentifier);
  $: combined = [...breadcrumbList, ...assetList];
</script>

<div class="h-full relative">
  <div class="p-4 pb-1">
    <h2 class="my-0 mb-2">
      <span>Content credentials</span>
      <cai-tooltip class="theme-spectrum ml-2"
        ><div slot="content">
          Tamper-evident editing and activity data attached on export, including
          additional images and anything else used to make the selected content.
        </div>
      </cai-tooltip>
    </h2>
    <div class="mb-4 leading-small text-gray-700">
      These assets are in chronological order, starting with the latest version.
      Select one to explore its own content credentials.
    </div>
  </div>
  <div class="relative pl-4">
    <div bind:this={container} class="grid space-y-4">
      {#each breadcrumbList as asset, index (asset._id)}
        <Asset
          {asset}
          {isCompareMode}
          id={`record-${index}`}
          current={asset._id === $primaryId}
          hasConnector={index > 0}
        />
      {/each}
      <div class="grid space-y-4">
        {#each assetList as asset (asset._id)}
          <div>
            <Asset {asset} {isCompareMode} indented />
          </div>
        {/each}
      </div>
    </div>
  </div>
  {#if isSecureCapture(claim)}
    <div class="mx-4">
      <OriginalCreation />
    </div>
  {/if}
  {#if combined.length > 0}
    <div
      class="sticky bottom-0 left-0 right-0 pb-4 pt-8 pointer-events-none flex justify-center w-full bg-gradient-to-t from-white via-white to-transparent"
    >
      <div class="pointer-events-auto">
        <Button
          on:click={() => (isCompareMode = !isCompareMode)}
          secondary={!isCompareMode}>Compare records</Button
        >
      </div>
    </div>
  {/if}
  {#if source && !claim}
    <div class="relative pl-4">
      <div bind:this={container} class="grid space-y-4">
        <Asset {source} current={true} />
      </div>
    </div>
  {/if}
</div>
