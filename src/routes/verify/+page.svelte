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
  import Title from '../../components/typography/Title.svelte';
  import {
    SidebarLayout,
    sidebarLayoutPageState,
  } from '../../features/SidebarLayout';

  let showResponsiveInfoPanel = false;

  function togglePanel() {
    showResponsiveInfoPanel = !showResponsiveInfoPanel;
  }
</script>

<SidebarLayout>
  <div slot="header">{$_('page.verify.title')}</div>
  <div slot="sidebar">
    <button
      class="m-2 bg-blue-600 p-2 text-white lg:hidden"
      on:click={() => sidebarLayoutPageState.next()}>NEXT</button>
  </div>
  <div
    slot="content"
    class="h-full grid-cols-[auto_theme(spacing.sidebar)] sm:grid">
    <div class="h-[calc(100vh-theme(spacing.header))] lg:h-screen">
      <button
        class="m-2 bg-blue-600 p-2 text-white sm:hidden"
        on:click={togglePanel}>Reveal</button>
    </div>
    <div
      class="h-screen overflow-hidden bg-gray-50 transition-transform sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
      class:-translate-y-full={showResponsiveInfoPanel}>
      <div class="flex h-20 items-center border-b-2 bg-gray-50 px-6 shadow">
        <Title>Content</Title>
      </div>
      <button
        class="m-2 bg-blue-600 p-2 text-white sm:hidden"
        on:click={togglePanel}>Hide</button>
    </div>
  </div>
  <svelte:fragment slot="back-bar">{$_('page.home.title')}</svelte:fragment>
</SidebarLayout>
