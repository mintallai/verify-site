<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import cssVars from 'svelte-css-vars';
  import CircleLoader from '../CircleLoader.svelte';
  import { urlParams, summary } from '../../stores';
  import { loadFile } from '../../lib/file';
  import '@contentauth/web-components/dist/icons/monochrome/broken-image';

  export let thumbnailURL: string = null;
  export let isDragging: boolean = false;
  export let isLoading: boolean = false;
  export let isError: boolean = false;

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

<div
  class="viewer"
  class:no-source={!source}
  class:upload={uploadMode}
  class:dragging={isDragging}
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <input type="file" bind:this={fileInput} accept="image/jpeg" class="hidden" />
  <div class="inner" use:cssVars={styles}>
    {#if uploadMode}
      <div class="upload-content" in:fade>
        <svg
          width="58"
          height="99"
          xmlns="http://www.w3.org/2000/svg"
          class="message-illustration"
        >
          <g
            stroke="currentColor"
            stroke-width="3"
            fill="none"
            fill-rule="evenodd"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21.216 73.125H3.5a2 2 0 01-2-2V3.5a2 2 0 012-2h31.443M55.942 27.41v43.714a2 2 0 01-2 2H34.216"
            />
            <path
              d="M55.942 22.5h-21v-21zM27.722 55.316V96.06M17.942 87.762l9.146 9.277a.998.998 0 001.424 0l9.146-9.277"
            />
          </g>
        </svg>
        {#if source || $summary}
          <div class="message-heading">Drop your file</div>
        {:else}
          <div class="message-heading">Drag and drop your file</div>
          <div class="message-text">
            <span class="link" on:click={browseFile}>Select a JPG</span> from your
            computer
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
        {#if isError}
          <cai-icon-broken-image />
        {:else}
          <CircleLoader />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .viewer {
    @apply w-full flex items-center justify-center overflow-hidden;
    grid-area: viewer;
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
  .dragging .inner .message-illustration {
    @apply text-blue-500;
  }
  .upload-content {
    @apply absolute inset-0 flex justify-center items-center flex-col;
  }
  cai-icon-broken-image {
    @apply text-gray-600;
    --cai-icon-width: 100px;
    --cai-icon-height: 100px;
  }
  @screen md {
    .viewer {
      @apply bg-gray-75;
    }
  }
</style>
