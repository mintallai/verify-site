<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { tweened } from 'svelte/motion';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Asset from './Asset.svelte';
  import {
    contentSourceIds,
    assetsByIdentifier,
    primaryId,
  } from '../../stores';
  import { getBreadcrumbList } from '../../lib/claim';

  const [add, remove] = crossfade({
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      const dropFrom = 20;

      return {
        duration: 600,
        easing: cubicOut,
        css: (t: number) => `
					transform: ${transform} translateY(${dropFrom - t * dropFrom}px);
					opacity: ${t}
				`,
      };
    },
  });

  let resizeObserver: any;
  let container: any;
  let bgStyles = tweened(
    { top: 0, width: 0 },
    {
      duration: 0,
      easing: cubicOut,
    },
  );
  let prevActiveItem: HTMLElement | undefined;

  onMount(() => {
    if (container && $primaryId) {
      // Waiting on https://github.com/microsoft/TypeScript/issues/37861
      // @ts-ignore
      resizeObserver = new ResizeObserver(() => {
        // TODO: Optimize this
        const activeItem = container.querySelector('div.current');
        let duration = 0;
        if (prevActiveItem !== activeItem && $bgStyles.width) {
          duration = 400;
          prevActiveItem = activeItem;
        }
        bgStyles.set(
          {
            top: activeItem.offsetTop,
            width: activeItem.offsetWidth,
          },
          { duration },
        );
      });
      resizeObserver.observe(container);
    }
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });

  $: breadcrumbList = getBreadcrumbList($contentSourceIds, $assetsByIdentifier);
</script>

<style lang="postcss">
  .active-bg {
    @apply absolute bg-gray-200 rounded w-full z-0 pointer-events-none;
    height: 112px;
  }
  .breadcrumb-item {
    @apply relative;
  }
  .breadcrumb-item cai-tooltip {
    @apply absolute z-10 cursor-pointer;
    top: 10px;
    right: 10px;
  }
</style>

<div class="pb-4 border-b border-gray-200">
  <h2 class="my-0 mb-4">
    <span>Content record</span>
    <cai-tooltip
      class="ml-2"
      content="Tamper-evident editing and activity data attached on export, including additional images and anything else used to make the selected content." />
  </h2>
  <div class="mt-3 mb-4 leading-snug text-gray-700">
    Select an image to explore the content record.
  </div>
  <div class="relative">
    {#if $primaryId}
      <div
        class="active-bg"
        style="top: {$bgStyles.top}px; width: {$bgStyles.width}px;" />
    {/if}
    <div bind:this={container} class="grid">
      {#each breadcrumbList as asset, index (asset._id)}
        <div
          in:add={{ key: asset._id }}
          out:remove|local={{ key: asset._id }}
          animate:flip
          id={`record-${index}`}
          class="breadcrumb-item"
          class:current={asset._id === $primaryId}>
          {#if index === 0}
            <cai-tooltip
              content="This is the content you started with."
              class="info">
              <cai-icon name="Pin" width="20px" height="20px" />
            </cai-tooltip>
          {/if}
          <Asset {asset} hasConnector={index > 0} />
        </div>
      {/each}
    </div>
  </div>
</div>
