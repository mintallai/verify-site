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
<script>
  import ChevronLeft from '../../../assets/svg/monochrome/chevron-left.svg?component';
  import Header from '../../components/Header/Header.svelte';
  import HeaderTypo from '../../components/typography/Header.svelte';
  import { sidebarLayoutPageState } from './store/sidebarLayoutPageState';
</script>

<div
  class="grid h-screen grid-cols-[100vw_100vw] overflow-x-hidden lg:grid-cols-[theme(spacing.sidebar)_auto]">
  <div class="lg:border-e-2">
    <Header><slot name="header" /></Header>
    <div class="relative z-0 border-t-2">
      <slot name="sidebar" />
    </div>
  </div>
  <div
    class="h-screen overflow-hidden transition-transform lg:transform-none"
    class:-translate-x-full={$sidebarLayoutPageState === 1}>
    <div
      class="flex h-header items-center border-b bg-gray-50 px-6 sm:border-b-0 lg:hidden">
      <button
        class="flex items-center"
        on:click={() => sidebarLayoutPageState.back()}>
        <ChevronLeft class="pe-3" />
        <HeaderTypo><slot name="back-bar" /></HeaderTypo>
      </button>
    </div>

    <div class="h-full border-t-2 bg-gray-100 lg:border-none">
      <slot name="content" />
    </div>
  </div>
</div>
