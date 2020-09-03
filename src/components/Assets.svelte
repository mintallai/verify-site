<script lang="ts">
  import { assetList } from '../stores';
  import Asset from './Asset.svelte';

  $: {
    console.log('$assetList', $assetList);
  }
</script>

<style lang="postcss">
  .container {
    @apply grid gap-5 max-w-full;
    grid-template-columns: 94px auto;
    min-height: 0;
    min-width: 0;
  }
</style>

<div>
  <h2 class="mb-5">Assets</h2>
  <div class="container">
    {#each $assetList as asset}
      <Asset {asset} />
    {/each}
  </div>
</div>
