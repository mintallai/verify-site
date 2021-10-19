<script lang="ts">
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import { Claim } from '../lib/sdk';
  import About from '../components/About.svelte';
  import Alert from '../components/Alert.svelte';
  import AboutNoClaim from '../components/overview/AboutNoClaim.svelte';
  import FileDropper from '../components/FileDropper.svelte';
  import TopNavigation from '../components/inspect/TopNavigation.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import TreeView from '../components/overview/TreeView.svelte';
  import { startTour } from '../lib/tour';
  import { loader, setLoaderContext, ILoaderParams } from '../lib/loader';
  import { breakpoints } from '../lib/breakpoints';
  import {
    urlParams,
    provenance,
    primaryAsset,
    secondaryAsset,
    isBurgerMenuShown,
    isMobileViewerShown,
    isLoading,
  } from '../stores';

  let isDragging = false;
  let error = null;
  let tour: ReturnType<typeof startTour>;

  $: source = $provenance?.source;
  $: sourceParam = $urlParams.source;
  $: hasContent = sourceParam || $provenance || $isLoading;
  $: isUploadMode = !hasContent || isDragging;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);
  $: isMobileViewer = $isMobileViewerShown;
  $: noMetadata = !$provenance?.exists;
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

  const loaderParams: ILoaderParams = {
    onError(_err, message) {
      error = message;
    },
    onLoaded() {
      error = null;
      const { tourFlag, forceTourFlag } = $urlParams;
      if (isMobileViewer === false) {
        // tour = startTour({
        //   provenance: $provenance,
        //   start: tourFlag,
        //   force: forceTourFlag,
        // });
      }
    },
    onDragStateChange(newState: boolean) {
      isDragging = newState;
    },
  };
  setLoaderContext(loaderParams);
</script>

<svelte:window />
<svelte:head>
  <title>{$_('page.title')}</title>
</svelte:head>
<main
  use:loader={loaderParams}
  use:breakpoints
  class="theme-light"
  class:full-width={isUploadMode && !$provenance && !error}>
  {#if $isBurgerMenuShown}
    <div
      transition:fade={{ duration: 200 }}
      class="menu-overlay"
      on:click={() => isBurgerMenuShown.update((shown) => !shown)} />
  {/if}
  <Header />
  <TopNavigation {isComparing} {noMetadata} {source} currentPage="overview" />
  <div class="dragdrop">
    <FileDropper {isUploadMode} {isDragging} isError={!!error} />
    {#if isUploadMode && !error}
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
    <section class="right-col p-4 md:pt-4" class:loading={$isLoading}>
      <div class="wrapper">
        {#if error}
          <div class="w-full">
            <Alert severity="error">{$_(error)}</Alert>
          </div>
        {:else if primary instanceof Claim}
          <About claim={primary} {isComparing} {isMobileViewer} />
        {:else if $isLoading}
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
    --viewer-height: calc(100vh - 400px);
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
