<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import cssVars from 'svelte-css-vars';
  import Asset from './Asset.svelte';
  import Icon from './Icon.svelte';
  import { breadcrumbIds, assetsByIdentifier, primaryId } from '../stores';
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

  let container: any;
  let bgStyles = {
    top: `0`,
    height: `0`,
  };
  let resizeObserver: any;

  afterUpdate(() => {
    resizeObserver?.disconnect();
    if (container && $primaryId) {
      const activeItem = container.querySelector('div.current');
      if (activeItem) {
        // bgStyles.height = `${activeItem.offsetHeight}px`;
        // Waiting on https://github.com/microsoft/TypeScript/issues/37861
        // @ts-ignore
        resizeObserver = new ResizeObserver(([entry]) => {
          bgStyles.top = `${activeItem.offsetTop}px`;
          console.log('entries', entry.contentRect.top);
        });
        resizeObserver.observe(activeItem);
      }
    }
  });

  $: breadcrumbList = getBreadcrumbList($breadcrumbIds, $assetsByIdentifier);
</script>

<style lang="postcss">
  .active-bg {
    @apply absolute bg-gray-200 rounded w-full;
    top: var(--top);
    height: var(--height);
  }
</style>

<div class="p-2 relative">
  <h2 class="mb-5 p-3 pb-0 flex items-center">
    <span>Content Timeline</span>
    <Icon size="m" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
  </h2>
  {#if $primaryId}
    <div class="active-bg" use:cssVars={bgStyles} />
  {/if}
  <div bind:this={container} class="grid">
    {#each breadcrumbList as asset (asset._id)}
      <div
        in:add={{ key: asset._id }}
        out:remove={{ key: asset._id }}
        animate:flip
        class:current={asset._id === $primaryId}>
        <Asset {asset} />
      </div>
    {/each}
  </div>
</div>
