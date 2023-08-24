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
  import Body from '../../../../components/typography/Body.svelte';
  import AssetInfoThumbnailBase from './AssetInfoThumbnailBase.svelte';
  export let thumbnail: string | null = null;
  export let date: Date | null = null;
</script>

<AssetInfoThumbnailBase {date} {thumbnail}>
  <Body slot="name"><slot name="name" /></Body>
</AssetInfoThumbnailBase>
