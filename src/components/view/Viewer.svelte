<script lang="ts">
  import cssVars from 'svelte-css-vars';
  import CircleLoader from '../CircleLoader.svelte';

  let width = 0;
  let height = 0;
  let side = `0px`;
  let padding = 20;

  $: {
    side = `${Math.min(width, height) - padding * 2}px`;
  }
  $: styles = {
    width: side,
    height: side,
  };

  export let thumbnailURL: string = null;
  export let isLoading: boolean = false;
</script>

<style lang="postcss">
  .inner {
    @apply rounded-md overflow-hidden bg-white shadow-md;
    width: var(--width);
    height: var(--height);
    min-width: 256px;
  }
</style>

<div
  class="bg-gray-100 flex items-center justify-center overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <div class="inner" use:cssVars={styles}>
    {#if !isLoading && thumbnailURL}
      <img
        src={thumbnailURL}
        alt=""
        class="h-full w-full object-contain object-center" />
    {:else}
      <div class="inner flex items-center justify-center">
        <CircleLoader />
      </div>
    {/if}
  </div>
</div>
