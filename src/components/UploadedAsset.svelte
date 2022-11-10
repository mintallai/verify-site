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
  import { locale, _ } from 'svelte-i18n';
  import { isMobileViewerShown } from '../stores';
  import BreadcrumbAsset from './BreadcrumbAsset.svelte';
  import PopoverManifestRecov from './PopoverManifestRecov.svelte';
  $: placement = $isMobileViewerShown ? 'bottom' : 'left-start';
</script>

{#if $isMobileViewerShown}
  <div class="mr-4 inline-block self-center">
    <BreadcrumbAsset value={null} />
  </div>
  <div class="inline-block self-center">
    <PopoverManifestRecov {placement} />
  </div>
{:else}
  <div class="grid grid-rows-3 gap-0 pt-2 w-[235px]">
    <div class="text-xs text-gray-700 self-center font-bold">
      {$_('comp.topNavigation.yourFile')}
    </div>
    <div class="grid grid-cols-5 row-span-2 w-[235px]">
      <div class="mr-4 cols-span-4 self-center w-[207px]">
        <BreadcrumbAsset value={null} />
      </div>
      <div class="self-center ml-[210px] pt-2">
        <PopoverManifestRecov {placement} />
      </div>
    </div>
  </div>
{/if}
