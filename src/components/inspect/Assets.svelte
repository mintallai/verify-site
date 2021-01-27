<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Asset from './Asset.svelte';
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

<div>
  <h2 class="my-3">
    <span>Content elements</span>
    <cai-tooltip
      class="ml-2"
      content="Images and anything else the producer used to make the selected content."
    />
  </h2>
  <div class="mb-3 leading-snug text-gray-700">
    {#if !assetList.length}
      This is an original source. No additional elements were used.
    {/if}
  </div>
  <div class="container">
    {#each assetList as asset (asset._id)}
      <div
        in:add={{ key: asset._id }}
        out:remove|local={{ key: asset._id }}
        animate:flip
      >
        <Asset {asset} />
      </div>
    {/each}
  </div>
</div>
