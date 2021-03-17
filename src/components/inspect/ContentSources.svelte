<script lang="ts">
  import Asset from './Asset.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
  } from '../../stores';
  import { getAssetList, getBreadcrumbList } from '../../lib/claim';

  export let claim: IClaimSummary | null;
  let container: any;

  $: assetList = claim ? getAssetList(claim, $assetsByIdentifier) : [];
  $: breadcrumbList = getBreadcrumbList($contentSourceIds, $assetsByIdentifier);
</script>

<div class="pb-4">
  <h2 class="my-0 mb-4">
    <span>Content record</span>
    <cai-tooltip
      class="ml-2"
      content="Tamper-evident editing and activity data attached on export, including additional images and anything else used to make the selected content."
    />
  </h2>
  <div class="mt-3 mb-4 leading-small text-gray-700">
    Select one of these elements to view more of the content record.
  </div>
  <div class="relative">
    <div bind:this={container} class="grid">
      {#each breadcrumbList as asset, index (asset._id)}
        <div class="breadcrumb-item" class:current={asset._id === $primaryId}>
          <Asset
            {asset}
            id={`record-${index}`}
            current={asset._id === $primaryId}
            hasConnector={index > 0}
          />
        </div>
      {/each}
      <div>
        {#each assetList as asset (asset._id)}
          <div>
            <Asset {asset} mini />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .breadcrumb-item {
    @apply relative;
  }
</style>
