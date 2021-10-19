<script lang="ts">
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import { Claim, Ingredient, Source } from '../lib/sdk';
  import About from '../components/About.svelte';
  import Alert from '../components/Alert.svelte';
  import TopNavigation from '../components/inspect/TopNavigation.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import CompareLatestButton from '../components/inspect/comparison/CompareLatestButton.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import Navigation from '../components/inspect/Navigation.svelte';
  import Comparison from '../components/inspect/Comparison.svelte';
  import ContentCredentialsError from '../components/inspect/ContentCredentialsError.svelte';
  import Viewer from '../components/inspect/Viewer.svelte';
  import { startTour } from '../lib/tour';
  import { loader, setLoaderContext, ILoaderParams } from '../lib/loader';
  import { breakpoints } from '../lib/breakpoints';
  import {
    urlParams,
    provenance,
    compareWithPath,
    primaryAsset,
    secondaryAsset,
    isBurgerMenuShown,
    isMobileViewerShown,
    isLoading,
  } from '../stores';
  import AboutNoClaim from '../components/overview/AboutNoClaim.svelte';

  function handleClose() {
    compareWithPath(null);
  }

  let isDragging = false;
  let error = null;
  let tour: ReturnType<typeof startTour>;

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

  $: source = $provenance?.source;
  $: sourceParam = $urlParams.source;
  $: hasContent = sourceParam || $provenance || $isLoading;
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
</script>

<svelte:window />
<svelte:head>
  <title>{$_('page.title')}</title>
</svelte:head>
<main
  use:loader={loaderParams}
  use:breakpoints
  class="theme-light"
  class:comparing={isComparing}>
  {#if $isBurgerMenuShown}
    <div
      transition:fade={{ duration: 200 }}
      class="menu-overlay"
      on:click={() => isBurgerMenuShown.update((shown) => !shown)} />
  {/if}
  <Header />
  <TopNavigation
    {isComparing}
    {noMetadata}
    {source}
    currentPage="inspect"
    on:back={handleClose} />
  {#if hasContent}
    {#if error}
      <section class="left-col" class:loading={$isLoading} />
      <Viewer isError={!!error} />
      <section class="right-col p-4">
        <Alert severity="error">{$_(error)}</Alert>
      </section>
    {:else if $isLoading}
      <section class="left-col" class:loading={$isLoading}>
        <CircleLoader />
      </section>
      <Viewer isLoading={true} {isDragging} />
      <section class="right-col" class:loading={$isLoading}>
        <CircleLoader />
      </section>
    {:else if noMetadata}
      <section class="left-col">
        <Navigation {source} />
      </section>
      <Viewer asset={$provenance?.source} {isDragging} />
      <section class="right-col p-4">
        <ContentCredentialsError {isComparing} />
      </section>
    {:else if primary}
      <section class="left-col col-compare">
        {#if !isComparing}
          <Navigation claim={primary} />
        {:else if primary instanceof Claim}
          <div class="col-compare w-full p-4 pt-0 md:pt-4">
            <About claim={primary} {isComparing} {isMobileViewer} />
          </div>
        {:else if primary instanceof Ingredient}
          <div class="col-compare wrapper">
            <AboutNoClaim {primary} {isComparing} />
          </div>
        {/if}
      </section>
      {#if isComparing}
        <Comparison {primary} {secondary} />
      {:else if primary instanceof Source}
        <Viewer asset={primary} {isDragging} />
      {:else}
        <Viewer asset={primary?.asset} {isDragging} />
      {/if}
      <section class="right-col p-4 pt-0 md:pt-4">
        {#if !isComparing && primary instanceof Claim}
          <div class="wrapper">
            <About claim={primary} {isComparing} {isMobileViewer} />
            {#if isMobileViewer}
              <CompareLatestButton claim={primary} {isComparing} />
            {/if}
          </div>
        {:else if !isComparing && primary instanceof Ingredient}
          <div class="wrapper">
            <AboutNoClaim {primary} {isComparing} />
            {#if isMobileViewer}
              <CompareLatestButton claim={null} {isComparing} />
            {/if}
          </div>
        {:else if secondary instanceof Claim}
          <About claim={secondary} {isComparing} {isMobileViewer} />
        {:else if secondary instanceof Ingredient}
          <AboutNoClaim primary={secondary} {isComparing} />
        {/if}
      </section>
    {/if}
  {:else}
    <section />
    <Viewer {isDragging} />
    {#if error}
      <section class="right-col p-4">
        <Alert severity="error">{$_(error)}</Alert>
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
  section.left-col {
    @apply hidden;
    grid-area: left;
  }
  section.right-col {
    @apply max-h-full;
    grid-area: right;
  }
  main.comparing section.right-col > .wrapper {
    @apply sticky top-10 justify-center;
  }
  .menu-overlay {
    @apply fixed inset-0 z-20;
    background-color: rgba(0, 0, 0, 0.2);
  }
  main.comparing {
    grid-template-columns: 50%;
    grid-template-rows: 80px 60px var(--viewer-height) 1fr 55px;
    grid-template-areas:
      'header header'
      'breadcrumb breadcrumb'
      'viewer viewer'
      'left right'
      'footer footer';
  }

  main.comparing section.left-col {
    @apply w-full h-full flex align-middle justify-center;
  }

  @screen lg {
    main,
    main.comparing {
      @apply fixed inset-0;
      grid-template-columns: 320px 1fr 320px;
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
