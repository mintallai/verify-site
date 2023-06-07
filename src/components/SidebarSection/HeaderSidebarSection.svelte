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
  import DownArrow from '../../../assets/svg/monochrome/down-arrow.svg?component';
  import Header from '../typography/Header.svelte';
  import SmallDescription from '../typography/SmallDescription.svelte';
  import SidebarSectionBase from './SidebarSectionBase.svelte';

  export let expanded = true;
</script>

<SidebarSectionBase {expanded}>
  <div slot="headerSection">
    <div class="flex justify-between">
      <Header><slot name="header" /></Header>
      <button on:click={() => (expanded = !expanded)}>
        <DownArrow
          class="h-2 w-3 transform duration-100 {expanded
            ? 'rotate-0'
            : '-rotate-90'}" />
      </button>
    </div>

    <div class:hidden={!expanded} class="pt-1">
      <SmallDescription><slot name="description" /></SmallDescription>
    </div>
  </div>
  <slot name="content" slot="content" /></SidebarSectionBase>
