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
  export let collapsible;
  export let title;
  export let helper;
  import CollapsibleSection from '../CollapsibleSection.svelte';
</script>

{#if collapsible}
  <div>
    <CollapsibleSection headerText={title} {helper}>
      <slot />
    </CollapsibleSection>
  </div>
{:else}
  <div>
    <div class="flex justify-between">
      <div class="flex font-bold text-75 uppercase text-gray-700">{title}</div>
      <cai-tooltip placement="right" class="theme-spectrum justify-end">
        <div slot="content" class="text-gray-900" style="width: 200px;">
          {helper}
        </div>
      </cai-tooltip>
    </div>
    <div class="relative top-2">
      <slot />
    </div>
  </div>
{/if}
