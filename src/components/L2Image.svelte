<script lang="ts">
  import {
    createL2ManifestStore,
    generateVerifyUrl,
    type DisposableL2ManifestStore,
  } from 'c2pa';
  import { onDestroy, onMount } from 'svelte';
  import { getSdk } from '../lib/sdk';

  export let sourceImage: string;
  export let placement: number;
  let result: DisposableL2ManifestStore;
  let viewMoreURL = generateVerifyUrl(sourceImage);

  async function getManifest(img: string) {
    const sdk = await getSdk();
    const res = await sdk.read(img);
    return createL2ManifestStore(res.manifestStore);
  }

  onMount(async () => {
    result = await getManifest(sourceImage);
  });

  onDestroy(() => result?.dispose?.());

  function setManifestStore(
    node: HTMLElement,
    manifestStore: DisposableL2ManifestStore,
  ) {
    (node as any).manifestStore = result.manifestStore;
  }
</script>

{#if result}
  <div class="wrapper">
    <cai-popover
      interactive
      class="theme-spectrum"
      placement="left-start"
      style:z-index={placement}>
      <cai-indicator slot="trigger" />
      <cai-manifest-summary
        use:setManifestStore={result}
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
