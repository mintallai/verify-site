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
  import { resultHierarchies, sourceHierarchy, activeAsset } from '../stores';
  import { ThumbnailEvent } from '../lib/thumbnail';
  import { getBadgeProps, getFilename, getManifest } from '../lib/node';
  import Thumbnail from './Thumbnail.svelte';

  let src = '';
  export let value: number | null;

  $: node = value != null ? $resultHierarchies[value] : $sourceHierarchy;
  $: manifest = getManifest(node);
  $: sigDate = manifest?.signature?.date;
  $: filename = getFilename(node);
  $: badgeProps = getBadgeProps(node);
  $: isActive =
    (value === null && $activeAsset[0] == 's') ||
    (value != null && $activeAsset[1] === value);

  function handleThumbnail(evt: CustomEvent<ThumbnailEvent>) {
    src = evt.detail.url;
  }

  function handleActiveAsset() {
    if (value != null) {
      activeAsset.set(['r', value]);
    } else {
      activeAsset.set(['s']);
    }
  }
</script>

<sp-theme color="lightest" scale="medium">
  <div class="container mt-1" class:active={isActive}>
    <sp-button onclick={handleActiveAsset}
      ><div class="grid grid-cols-4 gap-3">
        <Thumbnail {node} {...badgeProps} />
        <div class="col-span-3 text-left font-regular self-center">
          <p class="filename truncate">
            {filename}
          </p>
          {#if sigDate}
            <p class="date">
              {$date(sigDate, { format: 'medium' })}{' at '}
              {$time(sigDate, { format: 'short' })}
            </p>
          {/if}
        </div>
      </div></sp-button>
  </div>
</sp-theme>

<style lang="postcss">
  .container {
    --cai-thumbnail-size: 48px;
  }

  .container > sp-button {
    width: 207px;
    height: 52px;
    background-color: white;

    padding: 0;
  }
  .container > sp-button:hover {
    background-color: #ecf6ff;
    border: 2px solid #2680eb;
    border-radius: 5px;
    padding: 0;
  }
  .filename {
    color: #2c2c2c;
  }
  .date {
    color: #6e6e6e;
  }
  .active > sp-button {
    background-color: #ecf6ff;
    border: 2px solid #2680eb;
    border-radius: 5px;
    padding: 0;
  }
  .img-container {
    position: relative;
    display: inline-block;
  }
  .img-container img {
    display: block;
    max-width: 100%;
    height: auto;
  }
  .img-container svg {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
