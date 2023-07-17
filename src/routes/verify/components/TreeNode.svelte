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
  import type { ReadableAssetStore } from '../stores/asset';

  export let assetStore: ReadableAssetStore;
</script>

<button
  class="m-2 block rounded border-2 bg-white p-2"
  class:border-blue-900={$assetStore.state === 'selected'}
  class:border-gray-900={$assetStore.state === 'path'}
  on:click={$assetStore.select}>
  {`${$assetStore.id} - ${$assetStore.title}`}
</button>
