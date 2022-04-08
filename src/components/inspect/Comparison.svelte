<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import Split from './comparison/Split.svelte';
  import Slider from './comparison/Slider.svelte';
  import CircleLoader from '../CircleLoader.svelte';
  import { compareMode, CompareMode, isMobileViewerShown } from '../../stores';
  import type { HierarchyTreeNode } from '../../stores';
  import { _ } from 'svelte-i18n';

  const MIN_SIDE_PX = 256;

  let width = 0;
  let height = 0;
  let side = 0;
  let selectorHeight = 0;
  export let primary: HierarchyTreeNode;
  export let secondary: HierarchyTreeNode;
  export let isLoading: boolean = false;

  $: {
    const padding = $isMobileViewerShown ? 0 : 20;
    side = Math.max(
      MIN_SIDE_PX,
      Math.min(width, height) - padding * 2 - selectorHeight,
    );
  }
</script>

<div class="viewer-wrapper">
  <h6 class="lg:hidden pb-4">{$_('comp.comparison.compareContentCreds')}</h6>
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
</div>

<style lang="postcss">
  .viewer-wrapper {
    @apply flex flex-col;
  }
  .comparison {
    @apply w-full h-full bg-gray-200 rounded-md flex flex-col items-center justify-center overflow-hidden;
  }
  @screen lg {
    .comparison {
      @apply bg-gray-75 rounded-none;
    }
  }
</style>
