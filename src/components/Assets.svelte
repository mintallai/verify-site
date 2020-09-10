<script lang="ts">
  import { assetList } from '../stores';
  import Asset from './Asset.svelte';
</script>

<style lang="postcss">

</style>

<div class="p-2">
  <h2 class="mb-5 p-3 pb-0">Assets</h2>
  <div class="container">
    {#each $assetList as asset}
      <Asset {asset} />
    {/each}
  </div>
</div>
