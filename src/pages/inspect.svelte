<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import partial from 'lodash/partial';
  import dragDrop from 'drag-drop';
  import { getSummaryFromUrl, ToolkitError } from '../lib/toolkit';
  import About from '../components/About.svelte';
  import Alert from '../components/Alert.svelte';
  import Breadcrumb from '../components/inspect/Breadcrumb.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import Header from '../components/Header.svelte';
  import ContentRecord from '../components/inspect/ContentRecord.svelte';
  import Icon from '../components/Icon.svelte';
  import Comparison from '../components/inspect/Comparison.svelte';
  import ContentCredentialsError, {
    Status as ContentCredentialsStatus,
  } from '../components/inspect/ContentCredentialsError.svelte';
  import Viewer from '../components/inspect/Viewer.svelte';
  import { processFiles } from '../lib/file';
  import { startTour } from '../lib/tour';
  import {
    urlParams,
    source as sourceStore,
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

  let isDraggingOver = false;
  let error: ToolkitError;
  let tour: ReturnType<typeof startTour>;
  let winW = 0;
  let winH = 0;

  $: source = $sourceStore;
  $: sourceParam = $urlParams.source;
  $: hasContent = sourceParam || $summary || source;
  $: isLoading = $summary === null && source === null;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);
  $: noMetadata = !!(source && !$summary);
  $: showMobileOverlay = winW < 1024 || winH < 400;
  $: hasBreadcrumbBar = hasContent && (noMetadata || primary);
  $: {
    // Cancel the tour if the overlay is showing
    if (tour && tour.isActive() && showMobileOverlay) {
      tour.cancel();
    }
  }

  onMount(async () => {
    const { tourFlag, forceTourFlag } = $urlParams;
    if (sourceParam) {
      try {
        const result = await getSummaryFromUrl(sourceParam);
        window.newrelic?.setCustomAttribute('source', sourceParam);
        setSummary(result);
        if (!showMobileOverlay) {
          tour = startTour({
            summary: $summary,
            start: tourFlag,
            force: forceTourFlag,
          });
        }
      } catch (err) {
        error = err;
      }
    }

    // This stops the drag state from rapidly changing during drag
    // They also use this pattern in the dragDrop library
    let dragTimeout: number | undefined;
    const cleanupDragDrop = dragDrop('main', {
      async onDrop(files: File[]) {
        clearTimeout(dragTimeout);
        isDraggingOver = false;
        processFiles(files);
      },
      onDragOver() {
        clearTimeout(dragTimeout);
        isDraggingOver = true;
      },
      onDragLeave() {
        dragTimeout = setTimeout(() => {
          isDraggingOver = false;
        }, 50);
      },
    });
    return () => {
      cleanupDragDrop();
    };
  });
</script>

<svelte:window bind:innerWidth={winW} bind:innerHeight={winH} />
<main class="theme-light" class:has-breadcrumb-bar={hasBreadcrumbBar}>
  {#if showMobileOverlay}
    <div transition:fade={{ duration: 500 }} class="mobile-overlay">
      <div class="content">
        <Icon
          size="3xl"
          name="workflow:DeviceDesktop"
          class="text-blue-500 mb-3"
        />
        <div>
          Increase the size of your browser window to view. If you’re on a
          mobile device, open this page on a computer.
        </div>
      </div>
    </div>
  {/if}
  <Header />
  {#if hasBreadcrumbBar}
    <Breadcrumb
      {isComparing}
      {noMetadata}
      {source}
      on:back={partial(handleClose, secondary)}
    />
  {/if}
  {#if hasContent}
    {#if error}
      <section class="border-r-2" class:loading={isLoading} />
      <Viewer isError={!!error} />
      <section class="border-l-2 p-4">
        <Alert severity="error">Something went wrong</Alert>
      </section>
    {:else if isLoading}
      <section class="border-r-2" class:loading={isLoading}>
        <CircleLoader />
      </section>
      <Viewer isLoading={true} isDragging={isDraggingOver} />
      <section class="border-l-2" class:loading={isLoading}>
        <CircleLoader />
      </section>
    {:else if noMetadata}
      <section class="border-r-2">
        <ContentRecord {source} />
      </section>
      <Viewer thumbnailURL={source.url} isDragging={isDraggingOver} />
      <section class="border-l-2 p-4">
        <ContentCredentialsError status={ContentCredentialsStatus.None} />
      </section>
    {:else if primary}
      <section class="border-r-2">
        {#if !isComparing}
          <ContentRecord claim={primary?.type === 'claim' ? primary : null} />
        {:else if primary?.type === 'claim'}
          <div class="p-4">
            <About
              claim={primary}
              {isComparing}
              on:close={partial(handleClose, secondary)}
            />
          </div>
        {:else if primary?.type === 'reference'}
          <div class="p-4 h-full flex items-middle justify-center">
            <ContentCredentialsError />
          </div>
        {/if}
      </section>
      {#if isComparing}
        <Comparison {primary} {secondary} />
      {:else}
        <Viewer
          thumbnailURL={primary.thumbnail_url}
          isDragging={isDraggingOver}
        />
      {/if}
      <section class="border-l-2 p-4">
        {#if !isComparing && primary?.type === 'claim'}
          <About
            claim={primary}
            {isComparing}
            on:close={partial(handleClose, secondary)}
          />
        {:else if !isComparing && primary?.type === 'reference'}
          <ContentCredentialsError />
        {:else if secondary?.type === 'claim'}
          <About
            claim={secondary}
            {isComparing}
            on:close={partial(handleClose, primary)}
          />
        {:else if secondary?.type === 'reference'}
          <ContentCredentialsError />
        {/if}
      </section>
    {/if}
  {:else}
    <section />
    <Viewer isDragging={isDraggingOver} />
    <section />
  {/if}
  <footer>
    <span>Copyright © __year__ Adobe. All rights reserved.</span>
    <a href="https://www.adobe.com/privacy.html" target="_blank">Privacy</a>
    <a href="https://www.adobe.com/legal/terms.html" target="_blank"
      >Terms of use</a
    >
    <a href="https://contentauthenticity.org/contact" target="_blank"
      >Contact us</a
    >
  </footer>
</main>

<style lang="postcss">
  main {
    @apply grid absolute w-screen h-screen font-base;
    grid-template-columns: 320px auto 320px;
    grid-template-rows: 80px auto 55px;
  }
  main.has-breadcrumb-bar {
    grid-template-rows: 80px 60px auto 55px;
  }
  section {
    @apply col-span-1 border-gray-200 max-h-full overflow-auto;
  }
  section.loading {
    @apply flex items-center justify-center;
  }
  footer {
    @apply col-span-3 flex justify-center items-center text-75 border-t-2 border-gray-200;
    max-width: 100vw;
  }
  footer a {
    @apply underline;
  }
  footer a::before {
    @apply px-1;
    content: '|';
  }
  .mobile-overlay {
    @apply fixed flex justify-center items-center left-0 right-0 bg-white z-50;
    top: 80px;
    bottom: 55px;
  }
  .mobile-overlay .content {
    @apply flex flex-col justify-center items-center text-center text-xl leading-small;
    max-width: 354px;
  }
</style>
