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
  import { afterNavigate } from '$app/navigation';
  import { SidebarLayout } from '$src/features/SidebarLayout';
  import { _ } from 'svelte-i18n';
  import DragDropOverlay from './components/DragDropOverlay/DragDropOverlay.svelte';
  import EmptyState from './components/EmptyState/EmptyState.svelte';
  import InfoPanel from './components/InfoPanel/InfoPanel.svelte';
  import NavigationPanel from './components/NavigationPanel/NavigationPanel.svelte';
  import TreeView from './components/TreeView.svelte';
  import { dragDropAction, type DragDropActionParams } from './lib/drag-drop';
  import { verifyStore } from './stores';

  let showDropOverlay = false;
  let showInfoPanel = false;
  const { hierarchyView } = verifyStore;

  const dragDropParams: DragDropActionParams = {
    onDragStateChange(newState: boolean) {
      showDropOverlay = newState;
    },
  };

  $: hasEmptyState = $hierarchyView.state === 'none';

  // Check for `source` parameter and load that asset if it exists
  afterNavigate((nav: import('@sveltejs/kit').AfterNavigate) => {
    const { searchParams } = nav.to?.url ?? {};
    const source = searchParams?.get('source');

    if (!source) return;

    try {
      const sourceUrl = new URL(source);
      verifyStore.readC2paSource(sourceUrl.toString());
    } catch (err) {
      // Invalid source passed, ignore
      return;
    }
  });
</script>

<div use:dragDropAction={dragDropParams}>
  <DragDropOverlay visible={showDropOverlay} />
  <SidebarLayout leftColumnTakeover={hasEmptyState}>
    <svelte:fragment slot="header">{$_('page.verify.title')}</svelte:fragment>
    <svelte:fragment slot="sidebar">
      {#if hasEmptyState}
        <EmptyState />
      {:else if $hierarchyView.state === 'success'}
        <NavigationPanel asset={$hierarchyView.rootAsset} />
      {/if}
    </svelte:fragment>
    <div
      slot="content"
      class=" h-full grid-cols-[auto_theme(spacing.sidebar)] sm:grid">
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
</div>
