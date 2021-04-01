<script lang="ts">
  import Asset from './Asset.svelte';
  import Button from '../Button.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
  } from '../../stores';
  import { getAssetList, getBreadcrumbList } from '../../lib/claim';

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
      <span>Content record</span>
      <cai-tooltip class="theme-spectrum ml-2"
        ><div slot="content">
          Tamper-evident editing and activity data attached on export, including
          additional images and anything else used to make the selected content.
        </div>
      </cai-tooltip>
    </h2>
    <div class="mb-4 leading-small text-gray-700">
      Select one of these elements to view more of the content record.
    </div>
  </div>
  {#if claim}
    <div class="relative pl-4">
      <div bind:this={container} class="grid space-y-4">
        {#each breadcrumbList as asset, index (asset._id)}
          <Asset
            {asset}
            {isCompareMode}
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
    {#if combined.length > 0}
      <div class="absolute bottom-0 pb-4 flex justify-center w-full">
        <Button
          on:click={() => (isCompareMode = !isCompareMode)}
          secondary={!isCompareMode}>Compare records</Button
        >
      </div>
    {/if}
  {:else if source}
    <div class="relative pl-4">
      <div bind:this={container} class="grid space-y-4">
        <Asset {source} current={true} />
      </div>
    </div>
  {/if}
</div>
