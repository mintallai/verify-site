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
  import SmallThumbnail from '../Thumbnail/SmallThumbnail.svelte';
  import AssetInfoBase from './AssetInfoBase.svelte';
  export let thumbnail: string | null = null;
  export let date: Date | null = null;
</script>

<AssetInfoBase {date}>
  <SmallThumbnail {thumbnail} slot="thumbnail" />
  <slot slot="name" name="name" />
</AssetInfoBase>
