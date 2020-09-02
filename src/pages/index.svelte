<script lang="ts">
  import Header from '../components/Header.svelte';
  import Attribution from '../components/Attribution.svelte';
  import Viewer from '../components/Viewer.svelte';
  import { metatags } from '@sveltech/routify';
  import { primaryAsset } from '../stores';

  $: {
    console.log('$primaryAsset', $primaryAsset);
  }
</script>

<style lang="postcss">
  main {
    @apply grid absolute w-screen h-screen font-body;
    grid-template-columns: 320px auto 320px;
    grid-template-rows: 80px auto;
  }
  section {
    @apply col-span-1 p-5 border-gray-200;
  }
</style>

<main>
  <Header />
  {#if $primaryAsset}
    <section class="border-r">
      <Attribution data={$primaryAsset.verification} />
    </section>
    <Viewer thumbnailURL={$primaryAsset.thumbnailURL} />
    <section class="border-l">Right</section>
  {/if}
</main>
