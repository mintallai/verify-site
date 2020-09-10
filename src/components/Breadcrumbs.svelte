<script lang="ts">
  import { breadcrumbList, assetsByIdentifier } from '../stores';
  import Asset from './Asset.svelte';

  $: {
    console.log('$breadcrumbList', $breadcrumbList);
    console.log('$assetsByIdentifier', $assetsByIdentifier);
  }
</script>

<style lang="postcss">
</style>

{#if $breadcrumbList.length}
  <div class="p-2">
    <h2 class="mb-5 p-3 pb-0">Assets</h2>
    <div class="container">
      {#each $breadcrumbList as asset}
        <Asset {asset} />
      {/each}
    </div>
  </div>
{/if}
