<script lang="ts">
  import Header from '../components/Header.svelte';
  import { metatags } from '@sveltech/routify';
  metatags.title = 'CAI Verify';
  metatags.description = 'CAI Verify Site';

  const title: string = 'CAI Verify site';
</script>

<style lang="postcss">
  main {
    @apply grid fixed inset-0 font-body;
    grid-template-columns: 320px auto 320px;
    grid-template-rows: 80px auto;
    > section {
      @apply col-span-1 p-5 border-gray-200;
      &.left {
        @apply border-r;
      }
      &.center {
        @apply bg-gray-100;
      }
      &.right {
        @apply border-l;
      }
    }
  }
</style>

<main>
  <Header />
  <section class="side left">Left</section>
  <section class="center">Center</section>
  <section class="side right">Right</section>
</main>
