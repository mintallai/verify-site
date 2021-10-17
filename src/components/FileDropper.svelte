<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { provenance } from '../stores';
  import { loadFile } from '../lib/file';
  import DropFile from '../../assets/svg/monochrome/drop-file.svg';

  export let isUploadMode: boolean = false;
  export let isDragging: boolean = false;

  let fileInput: HTMLInputElement;

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
{#if isUploadMode}
  <div
    class="absolute inset-0 flex justify-center items-center flex-col z-20"
    in:fade>
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
