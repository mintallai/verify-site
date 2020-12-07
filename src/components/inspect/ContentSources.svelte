<script lang="ts">
  import Asset from './Asset.svelte';
  import { sortedAssets, primaryId } from '../../stores';

  let container: any;
</script>

<style lang="postcss">
  .breadcrumb-item {
    @apply relative;
  }
  .breadcrumb-item cai-tooltip {
    @apply absolute z-10 cursor-pointer;
    top: 10px;
    right: 10px;
  }
</style>

<div class="pb-4">
  <h2 class="my-0 mb-4">
    <span>Content record</span>
    <cai-tooltip
      class="ml-2"
      content="Tamper-evident editing and activity data attached on export, including additional images and anything else used to make the selected content." />
  </h2>
  <div class="mt-3 mb-4 leading-snug text-gray-700">
    Select an image to explore the content record.
  </div>
  <div class="relative">
    <div bind:this={container} class="grid">
      {#each $sortedAssets as asset, index (asset._id)}
        <div class="breadcrumb-item" class:current={asset._id === $primaryId}>
          {#if index === 0}
            <cai-tooltip
              content="This is the content you started with."
              class="info">
              <cai-icon name="Pin" width="20px" height="20px" />
            </cai-tooltip>
          {/if}
          <Asset
            {asset}
            id={`record-${index}`}
            current={asset._id === $primaryId}
            hasConnector={index > 0} />
        </div>
      {/each}
    </div>
  </div>
</div>
