<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
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
  import Body from '../../../components/typography/Body.svelte';
  import type { ReadableAssetStore } from '../stores/asset';
  import AssetInfoBase from './AssetInfo/AssetInfoBase.svelte';
  import TreeThumbnail from './Thumbnail/TreeThumbnail.svelte';
  export let assetStore: ReadableAssetStore;
</script>

<div class="ps-5 pt-4">
  <button on:click={$assetStore.select}>
    <div
      class="h-[10.25rem] w-[10.25rem] rounded border-2 border-gray-400 bg-white"
      class:border-blue-900={$assetStore.state === 'selected'}>
      <TreeThumbnail thumbnail={$assetStore.thumbnail} />
      <div class="bottom-0 py-2">
        <AssetInfoBase date={$assetStore.date}>
          <Body slot="name">{$assetStore.title}</Body>
        </AssetInfoBase>
      </div>
    </div></button>
</div>
