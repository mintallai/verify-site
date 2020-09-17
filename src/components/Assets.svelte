<script lang="ts">
  import Asset from './Asset.svelte';
  import Icon from './Icon.svelte';
  import { getAssetList } from '../lib/claim';
  import { assetsByIdentifier } from '../stores';

  export let claim: IClaimSummary;

  $: assetList = getAssetList(claim, $assetsByIdentifier);
</script>

<style lang="postcss">
  .original-creation {
    @apply bg-gray-800 mx-3 rounded flex flex-col items-center justify-center text-white;
    height: 280px;
  }
</style>

<div class="p-2">
  <h2 class="mb-5 p-3 pb-0 flex items-center">
    <span>Assets Used</span>
    <Icon size="m" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
  </h2>
  <div class="container">
    {#each assetList as asset}
      <Asset {asset} />
    {/each}
    {#if claim.edits.original_creation}
      <div class="original-creation">
        <img
          src="/images/svg/original-creation.svg"
          alt="Original Creation"
          width="86"
          height="156" />
        <div class="font-bold text-xl mt-5">Original Creation</div>
        <div class="mt-1">Learn More</div>
      </div>
    {/if}
  </div>
</div>
