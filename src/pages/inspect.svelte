<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
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
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
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
    compareWith,
    hasContent,
    isBurgerMenuShown,
    isComparing,
    isLoading,
    isMobileViewerShown,
    noMetadata,
    primary,
    sourceManifestStore,
    secondary,
    urlParams,
  } from '../stores';

  function handleClose() {
    compareWith(null);
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
      if ($isMobileViewerShown === false) {
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

  $: {
    // Cancel the tour if the overlay is showing
    if (tour && tour.isActive() && $isMobileViewerShown) {
      tour.cancel();
    }
    // Clear errors if the store report has changed
    if ($sourceManifestStore !== undefined) {
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
  class:no-content={!$hasContent}
  class:comparing={$isComparing}>
  {#if $isBurgerMenuShown}
    <div
      transition:fade={{ duration: 200 }}
      class="menu-overlay"
      on:click={() => isBurgerMenuShown.update((shown) => !shown)} />
  {/if}
  <Header />
  {#if $hasContent}
    <TopNavigation
      isComparing={$isComparing}
      noMetadata={$noMetadata}
      node={$primary}
      currentPage="inspect"
      on:back={handleClose} />
    {#if $isLoading}
      <!-- Asset/provenance data is loading -->
      <section class="left-col" class:loading={$isLoading}>
        <CircleLoader />
      </section>
      <Viewer isLoading={true} {isDragging} />
      <section
        data-test-id="inspect.right-col"
        class="right-col"
        class:loading={$isLoading}>
        <CircleLoader />
      </section>
    {:else if $noMetadata}
      <section class="left-col">
        <Navigation node={$primary} />
      </section>
      <Viewer node={$primary} {isDragging} />
      <section data-test-id="inspect.right-col" class="right-col p-4">
        <ContentCredentialsError isComparing={$isComparing} />
      </section>
    {:else if $primary}
      <!-- Asset has loaded, show manifest info -->
      <!-- Left column -->
      <section class="left-col">
        {#if $isComparing}
          <div class="w-full p-4">
            <About
              node={$primary}
              isComparing={$isComparing}
              isMobileViewer={$isMobileViewerShown} />
          </div>
        {:else}
          <Navigation node={$primary} />
        {/if}
      </section>
      <!-- Main area (viewer) -->
      {#if $isComparing}
        <Comparison primary={$primary} secondary={$secondary} />
      {:else}
        <Viewer node={$primary} {isDragging} />
      {/if}
      <!-- Right column -->
      <section
        data-test-id="inspect.right-col"
        class="right-col p-4 pt-0 md:pt-4">
        {#if $isComparing}
          <About
            node={$secondary}
            isComparing={$isComparing}
            isMobileViewer={$isMobileViewerShown} />
        {:else}
          <div class="wrapper">
            <About
              node={$primary}
              isComparing={$isComparing}
              isMobileViewer={$isMobileViewerShown} />
            {#if $isMobileViewerShown}
              <CompareLatestButton node={$primary} isComparing={$isComparing} />
            {/if}
          </div>
        {/if}
      </section>
    {/if}
  {:else}
    <!-- An unrecoverable error occurred (e.g. cannot load asset) -->
    <section />
    <Viewer {isDragging} isError={!!error} />
    {#if error}
      <section class="right-col p-4" data-test-id="inspect.right-col">
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
    grid-template-columns: 1fr 1fr;
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
    main.no-content {
      grid-template-rows: 80px 0 1fr 55px;
    }
    section {
      @apply overflow-auto;
    }
    section.left-col {
      @apply border-r-2 flex;
    }
    section.right-col {
      @apply border-l-2 overflow-x-hidden;
    }
    main.comparing section.right-col > .wrapper,
    section.right-col > .wrapper {
      @apply w-full h-full flex align-middle justify-center;
    }
  }
</style>
