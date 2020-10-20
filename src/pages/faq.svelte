<script lang="ts">
  import Header from '../components/Header.svelte';
  import '@spectrum-web-components/theme/theme-lightest.js';
  import '@spectrum-web-components/theme/scale-large.js';
  import '@spectrum-web-components/theme/sp-theme.js';
</script>

<style lang="postcss">
  main {
    @apply grid absolute w-screen h-screen font-body;
  }
</style>

<main>
  <Header />
</main>
