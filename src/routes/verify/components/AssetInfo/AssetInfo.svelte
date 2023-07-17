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
  import L1Icon from '../../../../../assets/svg/color/logos/L1.svg';
  import L1IconGrey from '../../../../../assets/svg/color/logos/L1Grey.svg';
  import FormattedDateTime from '../../../../components/FormattedDateTime/FormattedDateTime.svelte';
  import Body from '../../../../components/typography/Body.svelte';
  export let thumbnail: string;
  export let largeAssetInfo = false;
  export let date: Date | null = null;

  $: imgSrc = largeAssetInfo ? L1Icon : L1IconGrey;
</script>

<div class="flex items-center pt-3">
  <img
    src={thumbnail}
    class="bg-gray-20 h-12 w-12 bg-gray-200 object-contain"
    alt="" />
  <div class="ps-2.5">
    <Body><slot name="name" /></Body>
    {#if date}
      <div class="flex">
        <img src={imgSrc} class="me-2 h-4 w-4" alt={$_('page.apply.hasCC')} />
        <Body><FormattedDateTime sigDate={date} noTime /></Body>
      </div>
    {:else}
      <Body
        ><span class="text-gray-600">{$_('sidebar.verify.noCC')}</span></Body>
    {/if}
  </div>
</div>
