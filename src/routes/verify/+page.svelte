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
  import { SidebarLayout } from '../../features/SidebarLayout';
  import InfoPanel from './components/InfoPanel/InfoPanel.svelte';
  import NavigationPanel from './components/NavigationPanel/NavigationPanel.svelte';
  import TreeView from './components/TreeView.svelte';
  import { verifyStore } from './stores';

  let showInfoPanel = false;
  const { hierarchyView } = verifyStore;
</script>

<SidebarLayout>
  <svelte:fragment slot="header">{$_('page.verify.title')}</svelte:fragment>
  <svelte:fragment slot="sidebar">
    <NavigationPanel />
  </svelte:fragment>
  <div
    slot="content"
    class="h-full grid-cols-[auto_theme(spacing.sidebar)] sm:grid">
    <div class="h-full lg:h-screen">
      {#if $hierarchyView.state === 'success'}
        <TreeView assetStoreMap={$hierarchyView.assets} />
      {/if}
      <button
        class="m-2 bg-blue-600 p-2 text-white sm:hidden"
        on:click={() => (showInfoPanel = !showInfoPanel)}>Reveal</button>
    </div>
    <InfoPanel
      {showInfoPanel}
      on:isShown={() => (showInfoPanel = !showInfoPanel)} />
  </div>
  <svelte:fragment slot="back-bar">{$_('page.home.title')}</svelte:fragment>
</SidebarLayout>
