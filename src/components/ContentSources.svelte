<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import cssVars from 'svelte-css-vars';
  import Asset from './Asset.svelte';
  import { contentSourceIds, assetsByIdentifier, primaryId } from '../stores';
  import { getBreadcrumbList } from '../lib/claim';

  const [add, remove] = crossfade({
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      const dropFrom = -50;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} translateY(${dropFrom - t * dropFrom}px);
					opacity: ${t}
				`,
      };
    },
  });

  let resizeObserver;
  let container: any;
  let bgStyles = {
    top: `0`,
    height: `112px`,
    width: `0`,
  };

  onMount(() => {
    if (container && $primaryId) {
      // Waiting on https://github.com/microsoft/TypeScript/issues/37861
      // @ts-ignore
      resizeObserver = new ResizeObserver(([entry]) => {
        // TODO: Optimize this
        const activeItem = container.querySelector('div.current');
        bgStyles.top = `${activeItem.offsetTop}px`;
        bgStyles.width = `${activeItem.offsetWidth}px`;
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
    top: var(--top);
    height: var(--height);
    width: var(--width);
  }
</style>

<div class="p-2 relative">
  <h2 class="mb-5 p-3 pb-0 flex items-center"><span>Content sources</span></h2>
  {#if $primaryId}
    <div class="active-bg" use:cssVars={bgStyles} />
  {/if}
  <div bind:this={container} class="grid">
    {#each breadcrumbList as asset, index (asset._id)}
      <div
        in:add={{ key: asset._id }}
        out:remove={{ key: asset._id }}
        animate:flip={{ duration: 200 }}
        class:current={asset._id === $primaryId}>
        <Asset {asset} hasConnector={index > 0} />
      </div>
    {/each}
  </div>
</div>
