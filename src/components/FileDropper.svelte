<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount, getContext } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { provenance } from '../stores';
  import { CONTEXT_KEY } from '../lib/loader';
  import DropFile from '../../assets/svg/monochrome/drop-file.svg';

  export let isUploadMode: boolean = false;
  export let isDragging: boolean = false;
  export let isError: boolean = false;

  let fileInput: HTMLInputElement;
  const { loadFile } = getContext(CONTEXT_KEY);

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

<input
  type="file"
  bind:this={fileInput}
  accept="image/jpeg,image/png"
  class="hidden" />
{#if isUploadMode || isError}
  <div class="dropper" class:fullscreen={!isError} in:fade>
    <DropFile
      width={58}
      height={99}
      class="mb-8 {isDragging ? 'text-blue-500' : 'text-gray-500'}" />
    {#if $provenance}
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
{/if}

<style lang="postcss">
  .dropper {
    @apply flex justify-center items-center flex-col;
  }
  .dropper.fullscreen {
    @apply absolute inset-0 z-20;
  }
</style>
