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

{console.log('breadcrumbList', breadcrumbList)}

<div class="pb-4">
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
  <div class="relative">
    <div bind:this={container} class="grid space-y-4">
      {#each breadcrumbList as asset, index (asset._id)}
        <Asset
          {asset}
          id={`record-${index}`}
          current={asset._id === $primaryId}
          hasConnector={index > 0}
        />
      {/each}
      <div>
        {#each assetList as asset (asset._id)}
          <div>
            <Asset {asset} indented />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
