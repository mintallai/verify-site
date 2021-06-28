<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import partial from 'lodash/partial';
  import dragDrop from 'drag-drop';
  import { getStoreReportFromUrl, ToolkitError } from '../lib/toolkit';
  import About from '../components/About.svelte';
  import Alert from '../components/Alert.svelte';
  import Breadcrumb from '../components/inspect/Breadcrumb.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import CompareLatestButton from '../components/inspect/comparison/CompareLatestButton.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import ContentCredentials from '../components/inspect/ContentCredentials.svelte';
  import Comparison from '../components/inspect/Comparison.svelte';
  import ContentCredentialsError from '../components/inspect/ContentCredentialsError.svelte';
  import Viewer from '../components/inspect/Viewer.svelte';
  import { getAssociatedClaim, getThumbnailUrlForId } from '../lib/claim';
  import { processFiles } from '../lib/file';
  import { startTour } from '../lib/tour';
  import {
    urlParams,
    source as sourceStore,
    storeReport,
    setStoreReport,
    navigateToId,
    secondaryId,
    primaryAsset,
    secondaryAsset,
    isBurgerMenuShown,
    isMobileViewerShown,
  } from '../stores';
  import type { ViewableItem } from '../lib/types';

  function handleClose(navigateToAsset: ViewableItem) {
    navigateToId(navigateToAsset.id);
    secondaryId.set('');
  }

  let isDraggingOver = false;
  let error: ToolkitError;
  let tour: ReturnType<typeof startTour>;
  let breakpoints = __breakpoints__;
  let mdBreakpoint = `(max-width: ${breakpoints.md})`;
  let lgBreakpoint = `(max-width: ${breakpoints.lg})`;

  $: source = $sourceStore;
  $: sourceParam = $urlParams.source;
  $: hasContent = sourceParam || $storeReport || source;
  $: isLoading = $storeReport === null && source === null;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);
  $: primaryClaim = primary && getAssociatedClaim($storeReport, primary);
  $: secondaryClaim = secondary && getAssociatedClaim($storeReport, secondary);
  $: isMobileViewer = $isMobileViewerShown;
  $: noMetadata = !!(source && !$storeReport);
  $: hasBreadcrumbBar = hasContent && (noMetadata || primary);
  $: errorMessage =
    error &&
    (error === ToolkitError.InvalidFile
      ? 'Unsupported file type'
      : 'Something went wrong');
  $: {
    // Cancel the tour if the overlay is showing
    if (tour && tour.isActive() && isMobileViewer) {
      tour.cancel();
    }
    // Clear errors if the store report has changed
    if ($storeReport !== undefined) {
      error = null;
    }
  }

  /**
   * Make sure we close any open hamburger menu if we increase the
   * window size to a breakpoint where the menu is hidden
   */
  function handleBreakpointChange({ media, matches }) {
    if (media === mdBreakpoint && !matches && $isBurgerMenuShown) {
      isBurgerMenuShown.set(false);
    }
    if (media === lgBreakpoint) {
      isMobileViewerShown.set(matches);
    }
  }

  onMount(async () => {
    const listenBreakpoints = [mdBreakpoint, lgBreakpoint];
    const { tourFlag, forceTourFlag } = $urlParams;

    isMobileViewerShown.set(matchMedia(lgBreakpoint).matches);
    listenBreakpoints.forEach((bp) =>
      matchMedia(bp).addEventListener('change', handleBreakpointChange),
    );

    if (sourceParam) {
      try {
        const result = await getStoreReportFromUrl(sourceParam);
        window.newrelic?.setCustomAttribute('source', sourceParam);
        setStoreReport(result);
        if (isMobileViewer === false) {
          tour = startTour({
            storeReport: $storeReport,
            start: tourFlag,
            force: forceTourFlag,
          });
        }
      } catch (err) {
        error = err?.message;
      }
    }

    // This stops the drag state from rapidly changing during drag
    // They also use this pattern in the dragDrop library
    let dragTimeout: number | undefined;
    const cleanupDragDrop = dragDrop('main', {
      async onDrop(files: File[]) {
        clearTimeout(dragTimeout);
        isDraggingOver = false;
        try {
          await processFiles(files);
        } catch (err) {
          error = err?.message;
        }
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
      listenBreakpoints.forEach((bp) =>
        matchMedia(bp).removeEventListener('change', handleBreakpointChange),
      );
    };
  });
</script>

<svelte:window />
<main
  class="theme-light"
  class:comparing={isComparing}
  class:has-breadcrumb-bar={hasBreadcrumbBar}>
  {#if $isBurgerMenuShown}
    <div
      transition:fade={{ duration: 200 }}
      class="menu-overlay"
      on:click={() => isBurgerMenuShown.update((shown) => !shown)} />
  {/if}
  <Header />
  {#if hasBreadcrumbBar}
    <Breadcrumb
      {isComparing}
      {noMetadata}
      {source}
      on:back={partial(handleClose, secondary)} />
  {/if}
  {#if hasContent}
    {#if error}
      <section class="left-col" class:loading={isLoading} />
      <Viewer isError={!!error} />
      <section class="right-col p-4">
        <Alert severity="error">{errorMessage}</Alert>
      </section>
    {:else if isLoading}
      <section class="left-col" class:loading={isLoading}>
        <CircleLoader />
      </section>
      <Viewer isLoading={true} isDragging={isDraggingOver} />
      <section class="right-col" class:loading={isLoading}>
        <CircleLoader />
      </section>
    {:else if noMetadata}
      <section class="left-col">
        <ContentCredentials {source} />
      </section>
      <Viewer thumbnailUrl={source.dataUrl} isDragging={isDraggingOver} />
      <section class="right-col p-4">
        <ContentCredentialsError {isComparing} />
      </section>
    {:else if primary}
      <section class="left-col">
        {#if !isComparing}
          <ContentCredentials claim={primaryClaim} />
        {:else if primaryClaim}
          <div class="w-full p-4 pt-0 md:pt-4">
            <About
              claim={primaryClaim}
              {isComparing}
              {isMobileViewer}
              on:close={partial(handleClose, secondary)} />
          </div>
        {:else if primary?.type === 'ingredient'}
          <div class="wrapper">
            <ContentCredentialsError {isComparing} />
          </div>
        {/if}
      </section>
      {#if isComparing}
        <Comparison {primary} {secondary} />
      {:else}
        <Viewer
          thumbnailUrl={getThumbnailUrlForId($storeReport, primary.id)}
          isDragging={isDraggingOver} />
      {/if}
      <section class="right-col p-4 pt-0 md:pt-4">
        {#if !isComparing && primaryClaim}
          <div class="wrapper">
            <About
              claim={primaryClaim}
              {isComparing}
              {isMobileViewer}
              on:close={partial(handleClose, secondary)} />
            {#if isMobileViewer}
              <CompareLatestButton claim={primaryClaim} {isComparing} />
            {/if}
          </div>
        {:else if !isComparing && primary?.type === 'ingredient'}
          <div class="wrapper">
            <ContentCredentialsError {isComparing} />
            {#if isMobileViewer}
              <CompareLatestButton claim={null} {isComparing} />
            {/if}
          </div>
        {:else if secondaryClaim}
          <About
            claim={secondaryClaim}
            {isComparing}
            {isMobileViewer}
            on:close={partial(handleClose, primary)} />
        {:else if secondary?.type === 'ingredient'}
          <ContentCredentialsError {isComparing} />
        {/if}
      </section>
    {/if}
  {:else}
    <section />
    <Viewer isDragging={isDraggingOver} />
    {#if error}
      <section class="right-col p-4">
        <Alert severity="error">{errorMessage}</Alert>
      </section>
    {:else}
      <section />
    {/if}
  {/if}
  <Footer />
</main>

<style lang="postcss">
  main {
    --viewer-height: 375px;

    @apply grid w-screen min-h-screen font-base;
    grid-template-columns: 100%;
    grid-template-rows: 80px var(--viewer-height) 1fr 70px;
    grid-template-areas:
      'header'
      'viewer'
      'right'
      'footer';
  }
  main.has-breadcrumb-bar {
    grid-template-rows: 80px 60px var(--viewer-height) 1fr 70px;
    grid-template-areas:
      'header'
      'breadcrumb'
      'viewer'
      'right'
      'footer';
  }
  section {
    @apply col-span-1 border-gray-200 max-h-full;
  }
  section.loading {
    @apply flex items-center justify-center;
  }
  section.left-col {
    @apply hidden;
    grid-area: left;
  }
  section.right-col {
    @apply max-h-full;
    grid-area: right;
  }
  main.comparing section.right-col > .wrapper {
    @apply sticky top-10;
  }
  .menu-overlay {
    @apply fixed inset-0 z-20;
    background-color: rgba(0, 0, 0, 0.2);
  }
  main.comparing {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 80px var(--viewer-height) 1fr 55px;
    grid-template-areas:
      'header header'
      'viewer viewer'
      'left right'
      'footer footer';
  }
  main.comparing.has-breadcrumb-bar {
    grid-template-rows: 80px 60px var(--viewer-height) 1fr 55px;
    grid-template-areas:
      'header header'
      'breadcrumb breadcrumb'
      'viewer viewer'
      'left right'
      'footer footer';
  }
  main.comparing section.left-col {
    @apply flex;
  }
  @screen lg {
    main,
    main.comparing {
      @apply fixed inset-0;
      grid-template-columns: 320px 1fr 320px;
      grid-template-rows: 80px 1fr 55px;
      grid-template-areas:
        'header header header'
        'left viewer right'
        'footer footer footer';
    }
    main.has-breadcrumb-bar,
    main.comparing.has-breadcrumb-bar {
      grid-template-rows: 80px 60px 1fr 55px;
      grid-template-areas:
        'header header header'
        'breadcrumb breadcrumb breadcrumb'
        'left viewer right'
        'footer footer footer';
    }
    section {
      @apply overflow-auto;
    }
    section.left-col {
      @apply border-r-2 flex;
    }
    section.right-col {
      @apply border-l-2;
    }
    main.comparing section.right-col > .wrapper,
    section.right-col > .wrapper {
      @apply w-full h-full flex align-middle justify-center;
    }
  }
</style>
