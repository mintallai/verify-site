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
  import {
    SidebarLayout,
    sidebarLayoutPageState,
  } from '../../features/SidebarLayout';

  import AssetInfo from './components/AssetInfo.svelte';
  import ManifestRecoveryItem from './components/ManifestRecoveryItem.svelte';
  import TreeView from './components/TreeView.svelte';
  import { verifyStore } from './stores';

  let showResponsiveInfoPanel = false;

  const { hierarchyView, recoveredManifestResults } = verifyStore;

  function togglePanel() {
    showResponsiveInfoPanel = !showResponsiveInfoPanel;
  }

  function testAsset(url: string) {
    verifyStore.readC2paSource(url);
  }

  async function handleRecovery() {
    verifyStore.recoverManifests();
  }
</script>

<SidebarLayout>
  <div slot="header">{$_('page.verify.title')}</div>
  <div slot="sidebar">
    <button
      class="m-2 bg-blue-600 p-2 text-white lg:hidden"
      on:click={() => sidebarLayoutPageState.next()}>NEXT</button>
    <button class="m-2 bg-blue-600 p-2 text-white" on:click={handleRecovery}
      >Recover manifests</button>
    {#if $recoveredManifestResults.state === 'success'}
      {#each $recoveredManifestResults.manifests as manifest}
        <ManifestRecoveryItem recoveredManifestStore={manifest} />
      {/each}
    {:else if $recoveredManifestResults.state === 'loading'}
      Loading
    {/if}
  </div>
  <div
    slot="content"
    class="h-full grid-cols-[auto_theme(spacing.sidebar)] sm:grid">
    <div class="h-full lg:h-screen">
      {#if $hierarchyView.state === 'success'}
        <TreeView assetStoreMap={$hierarchyView.assets} />
      {/if}
      <button
        class="m-2 bg-blue-600 p-2 text-white sm:hidden"
        on:click={togglePanel}>Reveal</button>
    </div>
    <div
      class="h-screen overflow-hidden bg-gray-50 transition-transform sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
      class:-translate-y-full={showResponsiveInfoPanel}>
      {#if $hierarchyView.state === 'success'}
        <AssetInfo assetStore={$hierarchyView.selectedAssetStore} />
      {/if}
      <button
        class="m-2 bg-blue-600 p-2 text-white"
        on:click={() => testAsset('http://localhost:3000/XCA.jpg')}
        >Load asset</button>
      <button
        class="m-2 bg-blue-600 p-2 text-white"
        on:click={() => testAsset('http://localhost:3000/CAICAI.jpg')}
        >Load asset 2</button>

      <button
        class="m-2 bg-blue-600 p-2 text-white sm:hidden"
        on:click={togglePanel}>Hide</button>
    </div>
  </div>
  <svelte:fragment slot="back-bar">{$_('page.home.title')}</svelte:fragment>
</SidebarLayout>
