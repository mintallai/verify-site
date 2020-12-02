<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { tweened } from 'svelte/motion';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Asset from './Asset.svelte';
  import HelpIcon from '../HelpIcon.svelte';
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
    @apply absolute bg-gray-200 rounded w-full z-0;
    height: 112px;
  }
</style>

<div class="relative">
  <h2 class="mt-0">
    <span>Content record</span>
    <div class="icon">
      <HelpIcon
        size="s"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
    </div>
  </h2>
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
        class:current={asset._id === $primaryId}>
        <Asset {asset} hasConnector={index > 0} />
      </div>
    {/each}
  </div>
</div>
