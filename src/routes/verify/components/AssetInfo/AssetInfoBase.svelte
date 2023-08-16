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
  import { _ } from 'svelte-i18n';
  import L1Icon from '../../../../../assets/svg/color/logos/L1Grey.svg';
  import FormattedDateTime from '../../../../components/FormattedDateTime/FormattedDateTime.svelte';
  import Body from '../../../../components/typography/Body.svelte';
  import SmallThumbnail from '../Thumbnail/SmallThumbnail.svelte';
  export let thumbnail: string;
  export let date: Date | null = null;
</script>

<div class="flex items-center pt-3">
  <SmallThumbnail {thumbnail} />
  <div class="ps-2.5">
    <slot name="name" />
    {#if date}
      <div class="flex">
        <img src={L1Icon} class="me-2 h-4 w-4" alt={$_('page.apply.hasCC')} />
        <Body><FormattedDateTime sigDate={date} noTime /></Body>
      </div>
    {:else}
      <Body
        ><span class="text-gray-600">{$_('sidebar.verify.noCC')}</span></Body>
    {/if}
  </div>
</div>
