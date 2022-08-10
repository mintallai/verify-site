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
  import '@contentauth/web-components/dist/icons/monochrome/broken-image';
  import cssVars from 'svelte-css-vars';
  import { _ } from 'svelte-i18n';
  import { handleImgSrc, thumbnail } from '../../lib/thumbnail';
  import type { HierarchyTreeNode } from '../../stores';
  import { isMobileViewerShown, provenance } from '../../stores';
  import CircleLoader from '../CircleLoader.svelte';
  import FileDropper from '../FileDropper.svelte';
  import ViewControls from '../ViewControls.svelte';
  export let node: HierarchyTreeNode | null = null;
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
  $: isUploadMode = (!$provenance && !isLoading) || isDragging;
  $: hasThumbnail = node?.data?.thumbnail;
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
        {#if !isLoading && !isError && hasThumbnail}
          <div class="grid grid-cols-1 grid-rows-10">
            <div class="row-span-1"><ViewControls /></div>

            <img
              data-test-id="viewer.thumbnail"
              use:thumbnail={node}
              on:thumbnail={handleImgSrc}
              alt="Thumbnail"
              class="h-full w-full object-contain object-center row-span-9" />
          </div>
        {:else}
          <div class="flex items-center justify-center">
            {#if isError || (!isLoading && !hasThumbnail)}
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
</style>
