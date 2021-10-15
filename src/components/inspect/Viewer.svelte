<script lang="ts">
  import { _ } from 'svelte-i18n';
  import cssVars from 'svelte-css-vars';
  import CircleLoader from '../CircleLoader.svelte';
  import { urlParams, provenance, isMobileViewerShown } from '../../stores';
  import FileDropper from '../FileDropper.svelte';
  import '@contentauth/web-components/dist/icons/monochrome/broken-image';
  import { thumbnail, handleImgSrc } from '../../lib/thumbnail';
  import type { Asset, Source } from '../../lib/sdk';
  import debug from 'debug';

  const dbg = debug('viewer');

  export let asset: Asset | Source | undefined = undefined;
  export let isDragging: boolean = false;
  export let isLoading: boolean = false;
  export let isError: boolean = false;

  let width = 0;
  let height = 0;
  let side = `0px`;

  $: {
    const padding = $isMobileViewerShown ? 0 : 20;
    side =
      height > padding * 2
        ? `${Math.min(width, height) - padding * 2}px`
        : `0px`;
  }
  $: styles = {
    width: side,
    height: side,
  };
  $: urlSource = $urlParams.source;
  $: isUploadMode = (!urlSource && !$provenance && !isLoading) || isDragging;
</script>

<div class="viewer-wrapper">
  <div
    class="viewer"
    class:no-source={!$provenance && !isLoading}
    class:upload={isUploadMode}
    class:dragging={isDragging}
    bind:clientWidth={width}
    bind:clientHeight={height}>
    <div class="inner" use:cssVars={styles}>
      <FileDropper {isUploadMode} {isDragging} />
      {#if !isUploadMode}
        {#if !isLoading}
          <img
            use:thumbnail={asset}
            on:thumbnail={handleImgSrc}
            alt=""
            class="h-full w-full object-contain object-center" />
        {:else}
          <div class="flex items-center justify-center">
            {#if isError}
              <cai-icon-broken-image />
            {:else}
              <CircleLoader />
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .viewer {
    @apply w-full bg-gray-75 flex items-center justify-center overflow-hidden;
  }
  .viewer.no-source {
    @apply bg-white;
  }
  .inner {
    @apply flex justify-center bg-gray-75 rounded-md overflow-hidden border-0 border-transparent;
    width: var(--width);
    height: var(--height);
    min-width: 256px;
  }
  .upload .inner {
    @apply border-2 border-gray-300 bg-gray-100 text-gray-700 bg-opacity-100 border-dashed shadow-none relative;
  }
  .dragging .inner {
    @apply border-2 border-blue-500 border-solid text-blue-500;
    background-color: var(--drag-bg-color);
  }
  cai-icon-broken-image {
    @apply text-gray-600;
    --cai-icon-width: 100px;
    --cai-icon-height: 100px;
  }
  @screen lg {
    .viewer {
      @apply bg-gray-75;
    }
  }
</style>
