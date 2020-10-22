<script lang="ts">
  import Asset from './Asset.svelte';
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getAssetList } from '../../lib/claim';
  import { assetsByIdentifier } from '../../stores';

  export let claim: IClaimSummary;

  const [add, remove] = crossfade({
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      const dropFrom = -20;

      return {
        duration: 600,
        easing: cubicOut,
        css: (t) => `
					transform: ${transform} translateY(${dropFrom - t * dropFrom}px);
					opacity: ${t}
				`,
      };
    },
  });

  $: assetList = getAssetList(claim, $assetsByIdentifier);
</script>

<!--<style lang="postcss">
  .original-creation {
    @apply bg-gray-800 mx-3 rounded flex flex-col items-center justify-center text-white;
    height: 280px;
  }
</style>-->

<div class="p-2">
  <h2 class="mb-5 p-3 pb-0 flex items-center"><span>Assets used</span></h2>
  <div class="container">
    {#each assetList as asset (asset._id)}
      <div
        in:add={{ key: asset._id }}
        out:remove|local={{ key: asset._id }}
        animate:flip>
        <Asset {asset} />
      </div>
    {/each}
    <!-- <div class="original-creation">
      <img
        src="/images/svg/original-creation.svg"
        alt="Original Creation"
        width="86"
        height="156" />
      <div class="font-bold text-xl mt-5">Original Creation</div>
      <div class="mt-1">Learn More</div>
    </div> -->
  </div>
</div>
