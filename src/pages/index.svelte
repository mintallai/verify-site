<script lang="ts">
  import Header from '../components/Header.svelte';
  import Assets from '../components/Assets.svelte';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Attribution from '../components/Attribution.svelte';
  import Viewer from '../components/Viewer.svelte';
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
    @apply col-span-1 border-gray-200 max-h-full overflow-auto;
  }
</style>

<main>
  <Header />
  {#if $primaryAsset}
    <section class="border-r">
      <Attribution claim={$primaryAsset} />
    </section>
    <Viewer thumbnailURL={$primaryAsset.thumbnail_url} />
    <section class="border-l">
      <Breadcrumbs />
      <Assets />
    </section>
  {/if}
</main>
