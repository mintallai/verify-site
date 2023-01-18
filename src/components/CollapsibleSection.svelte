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
  // based on suggestions from:
  // Inclusive Components by Heydon Pickering https://inclusive-components.design/collapsible-sections/
  import DownArrow from '../../assets/svg/monochrome/down-arrow.svg';
  import Tooltip from './Tooltip.svelte';
  export let headerText: string;
  export let helper: string | null = null;
  export let expanded = true;
</script>

<div class="w-full" class:mb-4={!expanded}>
  <button
    class="flex w-full justify-between items-center"
    on:click={() => (expanded = !expanded)}>
    <div
      class="flex items-center space-x-1.5 text-left text-smd font-bold tracking-wide text-black flex-grow">
      <div class="flex-shrink whitespace-nowrap">{headerText}</div>
      {#if helper}
        <Tooltip placement="left"
          ><div slot="content" class="text-gray-900 w-[200px]">
            {helper}
          </div></Tooltip>
      {/if}
    </div>
    <DownArrow
      class="h-3 w-3 flex-shrink flex-grow-0 text-black mr-1 transform duration-100 {expanded
        ? 'rotate-0'
        : '-rotate-90'}" />
  </button>

  <div hidden={!expanded} class:mt-4={expanded}>
    <slot />
  </div>
</div>
