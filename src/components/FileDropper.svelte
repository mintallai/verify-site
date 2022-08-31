<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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
  import { fade } from 'svelte/transition';
  import { onMount, getContext } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { sourceManifestStore } from '../stores';
  import { CONTEXT_KEY } from '../lib/loader';
  import DropFile from '../../assets/svg/monochrome/drop-file.svg';
  export let isUploadMode: boolean = false;
  export let isDragging: boolean = false;
  export let isError: boolean = false;
  let fileInput: HTMLInputElement;
  const { loadFile } = getContext<any>(CONTEXT_KEY);
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
  data-test-id="viewer.fileInput"
  type="file"
  bind:this={fileInput}
  accept="image/jpeg,image/png"
  class="hidden" />
{#if isUploadMode || isError}
  <div
    data-test-id="viewer.upload"
    class="dropper"
    class:fullscreen={!isError}
    in:fade>
    <DropFile
      width={58}
      height={99}
      class="mb-8 {isDragging ? 'text-blue-500' : 'text-gray-500'}" />
    {#if $sourceManifestStore}
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
    @apply absolute inset-0 z-0;
  }
</style>
