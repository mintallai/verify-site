<script lang="ts">
  import store from 'store2';
  import Split from './comparison/Split.svelte';
  import Slider from './comparison/Slider.svelte';
  import CircleLoader from '../CircleLoader.svelte';

  const STORAGE_MODE_KEY = 'compareMode';
  const MIN_SIDE_PX = 256;

  enum CompareMode {
    Split = 'SPLIT',
    Slider = 'SLIDER',
  }

  let mode = store.local.get(STORAGE_MODE_KEY) || CompareMode.Split;
  let width = 0;
  let height = 0;
  let side = 0;
  let padding = 20;
  let selectorHeight = 0;

  $: {
    side = Math.max(
      MIN_SIDE_PX,
      Math.min(width, height) - padding * 2 - selectorHeight,
    );
  }

  export let primary: ViewableItem;
  export let secondary: ViewableItem;
  export let isLoading: boolean = false;

  function setMode(newMode: CompareMode) {
    mode = newMode;
    store.local.set(STORAGE_MODE_KEY, mode);
    window.newrelic?.addPageAction('setCompareMode', { compareMode: mode });
  }
</script>

<style lang="postcss">
  .selector {
    @apply grid grid-cols-2 mb-5 mt-3;
    grid-gap: 2px;
  }
  .selector button {
    @apply bg-gray-200 text-center font-bold text-sm py-2 outline-none transition-colors duration-150;
    width: 100px;
  }
  .selector button.selected {
    @apply bg-gray-800 text-white;
  }
</style>

<div
  class="bg-gray-100 flex flex-col items-center justify-center overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <div
    id="compare-selector"
    class="selector"
    bind:clientHeight={selectorHeight}>
    <button
      class="rounded-l-full"
      class:selected={mode === CompareMode.Split}
      on:click={() => setMode(CompareMode.Split)}>Split</button>
    <button
      class="rounded-r-full"
      class:selected={mode === CompareMode.Slider}
      on:click={() => setMode(CompareMode.Slider)}>Slider</button>
  </div>
  {#if !isLoading}
    {#if mode === CompareMode.Slider}
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
