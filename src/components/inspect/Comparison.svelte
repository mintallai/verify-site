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

<div
  class="bg-gray-100 flex flex-col items-center justify-center overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
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
