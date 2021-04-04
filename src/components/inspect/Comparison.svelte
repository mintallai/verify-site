<script lang="ts">
  import Split from './comparison/Split.svelte';
  import Slider from './comparison/Slider.svelte';
  import CircleLoader from '../CircleLoader.svelte';
  import { compareMode, CompareMode } from '../../stores';

  const MIN_SIDE_PX = 256;

  let width = 0;
  let height = 0;
  let side = 0;
  let padding = 20;
  let selectorHeight = 0;
  export let primary: ViewableItem;
  export let secondary: ViewableItem;
  export let isLoading: boolean = false;

  $: side = Math.max(
    MIN_SIDE_PX,
    Math.min(width, height) - padding * 2 - selectorHeight,
  );
</script>

<div class="comparison" bind:clientWidth={width} bind:clientHeight={height}>
  {#if !isLoading}
    {#if $compareMode === CompareMode.Slider}
      <Slider {primary} {secondary} {side} />
    {:else}
      <Split {primary} {secondary} {side} />
    {/if}
  {:else}
    <div class="inner flex items-center justify-center">
      <CircleLoader />
    </div>
  {/if}
</div>

<style lang="postcss">
  .comparison {
    @apply bg-gray-100 flex flex-col items-center justify-center overflow-hidden;
  }
</style>
