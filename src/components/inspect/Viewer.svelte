<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import cssVars from 'svelte-css-vars';
  import CircleLoader from '../CircleLoader.svelte';
  import Icon from '../Icon.svelte';
  import { urlParams, summary } from '../../stores';
  import { loadFile } from '../../lib/file';

  export let thumbnailURL: string = null;
  export let isDragging: boolean = false;
  export let isLoading: boolean = false;

  let fileInput: HTMLInputElement;
  let width = 0;
  let height = 0;
  let side = `0px`;
  let padding = 20;

  $: {
    side = `${Math.min(width, height) - padding * 2}px`;
  }
  $: styles = {
    width: side,
    height: side,
  };
  $: source = $urlParams.source;
  $: uploadMode = (!source && !$summary) || isDragging;

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

<input type="file" bind:this={fileInput} accept="image/jpeg" class="hidden" />
<div
  class="viewer"
  class:no-source={!source}
  class:upload={uploadMode}
  class:dragging={isDragging}
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <div class="inner" use:cssVars={styles}>
    {#if uploadMode}
      <div class="upload-content" in:fade>
        <Icon
          size="3xl"
          name="workflow:FolderOpenOutline"
          class="text-blue-500"
        />
        {#if source || $summary}
          <div class="upload-text">Drop your JPG here</div>
        {:else}
          <div class="upload-text">
            Drag and drop a JPG or <span on:click={browseFile}>browse</span>
          </div>
        {/if}
      </div>
    {:else if !isLoading && thumbnailURL}
      <img
        src={thumbnailURL}
        alt=""
        class="h-full w-full object-contain object-center"
      />
    {:else}
      <div class="flex items-center justify-center">
        <CircleLoader />
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .viewer {
    @apply w-full bg-gray-100 flex items-center justify-center overflow-hidden;
  }
  .viewer.no-source {
    @apply bg-white;
  }
  .inner {
    @apply flex justify-center rounded-md overflow-hidden bg-white shadow-md border-0 border-transparent transition-all duration-100;
    width: var(--width);
    height: var(--height);
    min-width: 256px;
  }
  .upload .inner {
    @apply border-2 border-blue-500 bg-gray-100 border-dashed shadow-none relative;
  }
  .dragging .inner {
    @apply border-4;
  }
  .upload-content {
    @apply absolute inset-0 bg-gray-100 flex justify-center items-center flex-col;
  }
  .upload-text {
    @apply font-bold text-xl mt-2;
  }
  .upload-text span {
    @apply text-blue-500 cursor-pointer;
  }
</style>
