<script lang="ts">
  import Header from '../components/Header.svelte';
  import Attribution from '../components/Attribution.svelte';
  import Viewer from '../components/Viewer.svelte';
  import { metatags } from '@sveltech/routify';
  metatags.title = 'CAI Verify';
  metatags.description = 'CAI Verify Site';

  const title: string = 'CAI Verify site';
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
  <section class="border-r">
    <Attribution />
  </section>
  <Viewer />
  <section class="border-l">Right</section>
</main>
