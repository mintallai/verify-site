<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
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
  import { date, time, _ } from 'svelte-i18n';
  import { getBadgeProps, getFilename, getManifest } from '../lib/node';
  import { selectFormattedDate } from '../lib/sdk';
  import { ThumbnailEvent } from '../lib/thumbnail';
  import {
    activeAsset,
    resultHierarchies,
    setActiveAsset,
    sourceHierarchy,
  } from '../stores';
  import FormattedDateTime from './FormattedDateTime.svelte';
  import Thumbnail from './Thumbnail.svelte';
  import Tooltip from './Tooltip.svelte';

  let src = '';
  export let value: number | null;

  $: node =
    value != null && $resultHierarchies
      ? $resultHierarchies[value]
      : $sourceHierarchy;
  $: manifest = getManifest(node);
  $: sigDate = selectFormattedDate(manifest);
  $: filename = getFilename(node);
  $: badgeProps = getBadgeProps(node);
  $: isActive =
    (value === null && $activeAsset[0] == 's') ||
    (value != null && $activeAsset[1] === value);

  function handleThumbnail(evt: CustomEvent<ThumbnailEvent>) {
    src = evt.detail.url;
  }

  function handleActiveAsset() {
    setActiveAsset(value);
  }
</script>

<button
  on:click={handleActiveAsset}
  class:active={isActive}
  class="bc-container"
  ><div class="grid grid-cols-[min-content_auto] gap-3">
    <Thumbnail {node} {...badgeProps} />
    <div class="text-left font-regular self-center">
      {#if filename.length > 24}
        <Tooltip placement="top">
          <div slot="trigger" class="max-w-[140px] ">
            <p class="filename truncate">{filename}</p>
          </div>
          <div slot="content" class="text-gray-900 w-[200px]">
            {filename}
          </div>
        </Tooltip>
      {:else}
        <p class="filename">{filename}</p>
      {/if}
      {#if sigDate}
        <FormattedDateTime {sigDate} noTime={true} />
      {/if}
    </div>
  </div></button>

<style lang="postcss">
  .bc-container {
    width: 247px;
    height: 52px;
    background-color: white;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 0;
    --cai-thumbnail-size: 48px;
  }
  .bc-container:hover {
    background-color: #ecf6ff;
    border: 2px solid #2680eb;
    border-radius: 5px;
    padding: 0;
  }
  .filename {
    color: #2c2c2c;
  }

  .active {
    background-color: #ecf6ff;
    border: 2px solid #2680eb;
    border-radius: 5px;
    padding: 0;
  }
</style>
