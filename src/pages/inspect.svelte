<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '@roxi/routify';
  import partial from 'lodash/partial';
  import dragDrop from 'drag-drop';
  import Mousetrap from 'mousetrap';
  import { getSummaryFromFile, getSummaryFromUrl } from '../lib/toolkit';
  import About from '../components/About.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import Header from '../components/Header.svelte';
  import ContentSources from '../components/inspect/ContentSources.svelte';
  import Assets from '../components/inspect/Assets.svelte';
  import NoInfo from '../components/inspect/NoInfo.svelte';
  import Comparison from '../components/inspect/Comparison.svelte';
  import DragOverlay from '../components/inspect/DragOverlay.svelte';
  import Viewer from '../components/inspect/Viewer.svelte';
  import {
    summary,
    setSummary,
    navigateToId,
    secondaryId,
    primaryAsset,
    secondaryAsset,
  } from '../stores';
  import { getIdentifier } from '../lib/claim';

  function handleClose(navigateToAsset: ViewableItem) {
    navigateToId(getIdentifier(navigateToAsset));
    secondaryId.set('');
  }

  let allowDragDrop = false;
  let isDraggingOver = false;

  $: isLoading = $summary === null;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);

  onMount(async () => {
    const params = new URLSearchParams(window.location.search?.substr(1));
    const asset = params.get('asset');
    if (asset) {
      const data = await getSummaryFromUrl(asset);
      setSummary(data);
    } else {
      $goto('/');
    }

    const keyCommand = 'ctrl+shift+d';
    Mousetrap.bind(keyCommand, () => {
      allowDragDrop = !allowDragDrop;
      console.log('Drag and drop enabled set to', allowDragDrop);
    });

    const cleanupDragDrop = dragDrop('main', {
      async onDrop(files: File[]) {
        if (allowDragDrop && files.length) {
          const data = await getSummaryFromFile(files[0]);
          setSummary(data);
        }
      },
      onDragOver() {
        if (allowDragDrop) isDraggingOver = true;
      },
      onDragLeave() {
        if (allowDragDrop) isDraggingOver = false;
      },
    });
    return () => {
      Mousetrap.unbind(keyCommand);
      cleanupDragDrop();
    };
  });
</script>

<style lang="postcss">
  main {
    @apply grid absolute w-screen h-screen font-body;
    grid-template-columns: 320px auto 320px;
    grid-template-rows: 80px auto;
  }
  section {
    @apply col-span-1 border-gray-200 max-h-full overflow-auto;
  }
  section.loading {
    @apply flex items-center justify-center;
  }
</style>

<main>
  {#if isDraggingOver}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 z-20 pointer-events-none">
      <DragOverlay />
    </div>
  {/if}
  <Header {allowDragDrop} />
  {#if isLoading}
    <section class="border-r" class:loading={isLoading}>
      <CircleLoader />
    </section>
    <Viewer isLoading={true} />
    <section class="border-l" class:loading={isLoading}>
      <CircleLoader />
    </section>
  {:else if primary}
    <section class="border-r p-4">
      {#if !isComparing}
        <ContentSources />
        {#if primary?.type === 'claim'}
          <div in:fade|local={{ duration: 200 }}>
            <Assets claim={primary} />
          </div>
        {/if}
      {:else if primary?.type === 'claim'}
        <About
          claim={primary}
          {isComparing}
          on:close={partial(handleClose, secondary)} />
      {:else if primary?.type === 'reference'}
        <NoInfo
          ingredient={primary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {/if}
    </section>
    {#if isComparing}
      <Comparison {primary} {secondary} />
    {:else}
      <Viewer thumbnailURL={primary.thumbnail_url} />
    {/if}
    <section class="border-l p-4">
      {#if !isComparing && primary?.type === 'claim'}
        <About
          claim={primary}
          {isComparing}
          on:close={partial(handleClose, secondary)} />
      {:else if !isComparing && primary?.type === 'reference'}
        <NoInfo
          ingredient={primary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if secondary?.type === 'claim'}
        <About
          claim={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if secondary?.type === 'reference'}
        <NoInfo
          ingredient={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {/if}
    </section>
  {/if}
</main>
