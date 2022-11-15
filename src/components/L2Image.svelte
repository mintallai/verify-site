<script lang="ts">
  import { createL2Manifest, generateVerifyUrl } from 'c2pa';
  import { onMount } from 'svelte';
  import { getSdk } from '../lib/sdk';
  export let sourceImage;
  export let placement;
  let manifest;
  let viewMoreURL = generateVerifyUrl(sourceImage);
  async function getManifest(img) {
    const sdk = await getSdk();
    const res = await sdk.read(img);
    return createL2Manifest(res.manifestStore.activeManifest);
  }
  onMount(async () => {
    manifest = await getManifest(sourceImage);
    manifest = manifest.manifest;
  });
</script>

{#if manifest}
  <div class="wrapper">
    <cai-popover interactive class="theme-spectrum" style:z-index={placement}>
      <cai-indicator slot="trigger" />
      <cai-manifest-summary
        {manifest}
        view-more-url={viewMoreURL}
        slot="content" />
    </cai-popover>
  </div>
{/if}

<style lang="postcss">
  .wrapper > cai-popover {
    @apply absolute top-[10px] right-[10px];
  }
</style>
