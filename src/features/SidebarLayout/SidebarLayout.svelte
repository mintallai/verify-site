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
  import Header from '../../components/Header/Header.svelte';
  import { sidebarLayoutPageState } from './store/sidebarLayoutPageState';
</script>

<div
  class="grid h-screen grid-cols-[100vw_100vw] overflow-x-hidden lg:grid-cols-[theme(spacing.sidebar)_auto]">
  <div class="lg:border-e-2">
    <Header><slot name="header" /></Header>
    <div class="border-t-2">
      <slot name="sidebar" />
    </div>
  </div>
  <div
    class="h-full lg:transform-none"
    class:-translate-x-full={$sidebarLayoutPageState === 1}>
    <slot name="content" />
  </div>
</div>
