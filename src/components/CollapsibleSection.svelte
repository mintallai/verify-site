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
<script>
  // based on suggestions from:
  // Inclusive Components by Heydon Pickering https://inclusive-components.design/collapsible-sections/
  export let headerText;
  export let helper;
  import DownArrow from '../../assets/svg/monochrome/down-arrow.svg';
  let expanded = true;
  function expand() {
    expanded = !expanded;
  }
</script>

<div>
  <h3 class="flex justify-between">
    <button
      class="flex font-bold text-75 uppercase text-gray-700"
      on:click={() => expand()}>
      <DownArrow
        class="h-4 w-4 text-gray-500 mr-1 transform {expanded
          ? 'rotate-0'
          : '-rotate-90'}" />
      {headerText}
    </button>
    <cai-tooltip placement="left" class="theme-spectrum">
      <div slot="content" class="text-gray-900" style="width: 200px;">
        {helper}
      </div>
    </cai-tooltip>
  </h3>

  <div hidden={!expanded} class="relative top-1.5">
    <div>
      <slot />
    </div>
  </div>
</div>
