<script lang="ts">
  import Slider from './comparison/Slider.svelte';
  import CircleLoader from '../CircleLoader.svelte';

  let width = 0;
  let height = 0;
  let side = 0;
  let padding = 20;

  $: {
    side = Math.min(width, height) - padding * 2;
  }

  export let primaryURL: string;
  export let secondaryURL: string;
  export let isLoading: boolean = false;
</script>

<div
  class="bg-gray-100 flex items-center justify-center overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  {#if !isLoading}
    <Slider {primaryURL} {secondaryURL} {side} />
  {:else}
    <div class="inner flex items-center justify-center">
      <CircleLoader />
    </div>
  {/if}
</div>
