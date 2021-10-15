<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import dragDrop from 'drag-drop';
  import { getSdk, Claim, Ingredient, Source } from '../lib/sdk';
  import About from '../components/About.svelte';
  import AboutNoClaim from '../components/overview/AboutNoClaim.svelte';
  import FileDropper from '../components/FileDropper.svelte';
  import TopNavigation from '../components/inspect/TopNavigation.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import TreeView from '../components/overview/TreeView.svelte';
  import { processFiles } from '../lib/file';
  import { startTour } from '../lib/tour';
  import {
    urlParams,
    provenance,
    setProvenance,
    compareWithPath,
    primaryAsset,
    secondaryAsset,
    isBurgerMenuShown,
    isMobileViewerShown,
    isLoading,
    setIsLoading,
  } from '../stores';

  let isDragging = false;
  let error = false;
  let tour: ReturnType<typeof startTour>;
  let breakpoints = __breakpoints__;
  let mdBreakpoint = `(max-width: ${breakpoints.md})`;
  let lgBreakpoint = `(max-width: ${breakpoints.lg})`;

  $: source = $provenance?.source;
  $: sourceParam = $urlParams.source;
  $: hasContent = sourceParam || $provenance || $isLoading;
  $: isUploadMode = !hasContent || isDragging;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);
  $: isMobileViewer = $isMobileViewerShown;
  $: noMetadata = !$provenance?.exists;
  $: errorMessage = error && 'Unknown';
  $: {
    // Cancel the tour if the overlay is showing
    if (tour && tour.isActive() && isMobileViewer) {
      tour.cancel();
    }
    // Clear errors if the store report has changed
    if ($provenance !== undefined) {
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

    if (sourceParam && !$provenance) {
      try {
        setIsLoading(true);
        try {
          const sdk = await getSdk();
          const result = await sdk.processImage(sourceParam);
          await window.newrelic?.setCustomAttribute('source', sourceParam);
          setProvenance(result);
        } catch (err) {
          console.error('Could not process file:', err);
          window.newrelic?.noticeError(err, {
            source: 'url',
          });
        } finally {
          setIsLoading(false);
        }
        if (isMobileViewer === false) {
          // tour = startTour({
          //   provenance: $provenance,
          //   start: tourFlag,
          //   force: forceTourFlag,
          // });
        }
      } catch (err) {
        error = err?.message;
      }
    }

    // This stops the drag state from rapidly changing during drag
    // They also use this pattern in the dragDrop library
    let dragTimeout: ReturnType<typeof setTimeout> | undefined;
    const cleanupDragDrop = dragDrop('main', {
      async onDrop(files: File[]) {
        clearTimeout(dragTimeout);
        isDragging = false;
        try {
          await processFiles(files);
        } catch (err) {
          error = err?.message;
        }
      },
      onDragOver() {
        clearTimeout(dragTimeout);
        isDragging = true;
      },
      onDragLeave() {
        dragTimeout = setTimeout(() => {
          isDragging = false;
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
<svelte:head>
  <title>{$_('page.title')}</title>
</svelte:head>
<main class="theme-light" class:full-width={isUploadMode && !$provenance}>
  {#if $isBurgerMenuShown}
    <div
      transition:fade={{ duration: 200 }}
      class="menu-overlay"
      on:click={() => isBurgerMenuShown.update((shown) => !shown)} />
  {/if}
  <Header />
  <TopNavigation {isComparing} {noMetadata} {source} currentPage="overview" />
  <div class="dragdrop">
    <FileDropper {isUploadMode} {isDragging} />
    {#if isUploadMode}
      <div
        class="upload-bg"
        class:dragging={isDragging}
        in:fade={{ duration: 150 }} />
    {/if}
  </div>
  {#if hasContent}
    {#if $isLoading}
      <div class="w-full h-full bg-gray-75 flex items-center justify-center">
        <CircleLoader />
      </div>
    {:else}
      <TreeView />
    {/if}
    <section class="right-col p-4 pt-0 md:pt-4" class:loading={$isLoading}>
      <div class="wrapper">
        {#if primary instanceof Claim}
          <About claim={primary} {isComparing} {isMobileViewer} />
        {:else if true}
          <div class="flex items-center justify-center">
            <CircleLoader />
          </div>
        {:else}
          <AboutNoClaim {primary} />
        {/if}
      </div>
    </section>
  {/if}
  <Footer />
</main>

<style lang="postcss">
  main {
    --viewer-height: 375px;
    --cai-thumbnail-size: 48px;
    --cai-thumbnail-badge-icon-width: 16px;
    --cai-thumbnail-badge-icon-height: 16px;

    @apply grid w-screen min-h-screen h-full font-base;
    grid-template-columns: 100%;
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
  section.right-col {
    @apply max-h-full;
    grid-area: right;
  }
  .menu-overlay {
    @apply fixed inset-0 z-20;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .dragdrop {
    @apply contents relative w-full h-full overflow-hidden;
  }
  .upload-bg {
    @apply bg-gray-75 absolute inset-0 z-10;
  }
  .upload-bg.dragging {
    @apply text-blue-500;
    background: linear-gradient(var(--drag-bg-color), var(--drag-bg-color)),
      linear-gradient(var(--white), var(--white));
  }
  @screen lg {
    main {
      @apply fixed inset-0;
      grid-template-columns: 1fr 320px;
      grid-template-rows: 80px 60px 1fr 55px;
      grid-template-areas:
        'header header'
        'breadcrumb breadcrumb'
        'viewer right'
        'footer footer';
    }
    main.full-width {
      grid-template-columns: 1fr;
      grid-template-areas:
        'header header'
        'breadcrumb breadcrumb'
        'viewer viewer'
        'footer footer';
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
