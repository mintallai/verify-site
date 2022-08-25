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
  import allo from '../../assets/sample-images/fake-news.jpg';
  import { date, locale, time, _ } from 'svelte-i18n';
  export let hasc2padata: boolean = true;
  import { resultHierarchies, sourceHierarchy } from '../stores';

  import { thumbnail, ThumbnailEvent } from '../lib/thumbnail';
  import type { HierarchyTreeNode } from '../stores';
  import {
    getBadgeProps,
    getFilename,
    getManifest,
    BadgeProps,
  } from '../lib/node';
  // export let node: HierarchyTreeNode;
  // export let isSelected = false;
  // export let badgeType: BadgeProps['badgeType'] = 'none';
  // export let badgeHelpText: BadgeProps['badgeHelpText'] = null;
  let src = '';

  function handleThumbnail(evt: CustomEvent<ThumbnailEvent>) {
    src = evt.detail.url;
  }
  import Thumbnail from './Thumbnail.svelte';
  let node;

  export let value: number | null;
  if (value != null) {
    node = $resultHierarchies[value];
  } else {
    node = $sourceHierarchy;
  }
  $: manifest = getManifest(node);
  $: sigDate = manifest?.signature?.date;
  $: filename = getFilename(node);
  $: badgeProps = getBadgeProps(node);

  console.log($resultHierarchies[value]);
</script>

<sp-theme color="lightest" scale="medium">
  <div class="container mt-1">
    <sp-button
      ><div class="grid grid-cols-4 gap-3">
        <Thumbnail {node} {...badgeProps} />
        <div class="col-span-3 text-left font-regular self-center">
          <p class="filename">
            {filename}
          </p>

          <p class="date">
            {$date(sigDate, { format: 'medium' })}{' at '}
            {$time(sigDate, { format: 'short' })}
          </p>
        </div>
      </div></sp-button>
  </div>
</sp-theme>

<style lang="postcss">
  .container {
    --cai-thumbnail-size: 39px;
  }
  img {
    width: 48px;
    height: 48px !important;
  }
  .container > sp-button {
    width: 207px;
    height: 48px;
    background-color: white;

    padding: 0;
  }
  .container > sp-button:hover {
    width: 207px;
    height: 48px;
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
