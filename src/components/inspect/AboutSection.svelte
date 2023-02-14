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
  import Tooltip from '../Tooltip.svelte';
  export let title: string | null = null;
  export let helper: string | null = null;
</script>

<div>
  <div class="section-grid">
    {#if title}
      <div class="font-bold text-75 uppercase text-gray-700">
        {title}
      </div>
    {/if}
    {#if helper}
      <Tooltip placement="right">
        <div slot="content" class="text-gray-900 w-[200px]">
          {helper}
        </div></Tooltip>
    {/if}
  </div>
  <div>
    <slot />
  </div>
</div>

<style lang="postcss">
  .section-grid {
    @apply w-full grid grid-cols-2 grid-rows-1 mb-2;
    grid-template-columns: auto min-content;
  }
</style>
