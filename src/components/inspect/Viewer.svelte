<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import cssVars from 'svelte-css-vars';
  import CircleLoader from '../CircleLoader.svelte';
  import {
    urlParams,
    storeReport,
    source,
    isMobileViewerShown,
  } from '../../stores';
  import { loadFile } from '../../lib/file';
  import DropFile from '../../../assets/svg/monochrome/drop-file.svg';
  import '@contentauth/web-components/dist/icons/monochrome/broken-image';

  export let thumbnailUrl: string = null;
  export let isDragging: boolean = false;
  export let isLoading: boolean = false;
  export let isError: boolean = false;

  let fileInput: HTMLInputElement;
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
  $: uploadMode = (!urlSource && !$source && !$storeReport) || isDragging;

  function browseFile() {
    fileInput.click();
  }

  onMount(() => {
    fileInput.addEventListener('change', loadFile, false);
    return () => {
      fileInput.removeEventListener('change', loadFile);
    };
  });
</script>

<div class="viewer-wrapper">
  <div
    class="viewer"
    class:no-source={!$source}
    class:upload={uploadMode}
    class:dragging={isDragging}
    bind:clientWidth={width}
    bind:clientHeight={height}>
    <input
      data-test-id="viewer.fileInput"
      type="file"
      bind:this={fileInput}
      accept="image/jpeg,image/png"
      class="hidden" />
    <div class="inner" use:cssVars={styles}>
      {#if uploadMode}
        <div data-test-id="viewer.upload" class="upload-content" in:fade>
          <DropFile
            width={58}
            height={99}
            class="mb-8 {isDragging ? 'text-blue-500' : 'text-gray-500'}" />
          {#if $source || $storeReport}
            <div class="message-heading">{$_('comp.viewer.dropFile')}</div>
          {:else}
            <div class="message-heading">{$_('comp.viewer.dragDropFile')}</div>
            <div class="message-text">
              <span class="link" on:click={browseFile}>
                {$_('comp.viewer.selectFromComputer')}
              </span>
            </div>
          {/if}
        </div>
      {:else if !isLoading && thumbnailUrl}
        <img
          data-test-id="viewer.thumbnail"
          src={thumbnailUrl}
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
    background-color: rgba(20, 115, 230, 0.1);
  }
  .upload-content {
    @apply absolute inset-0 flex justify-center items-center flex-col;
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
