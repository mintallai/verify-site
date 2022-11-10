<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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
  import { goto, params } from '@roxi/routify';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import About from '../components/About.svelte';
  import Alert from '../components/Alert.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import FileDropper from '../components/FileDropper.svelte';
  import Footer from '../components/Footer.svelte';
  import Header from '../components/Header.svelte';
  import ContentCredentialsError from '../components/inspect/ContentCredentialsError.svelte';
  import TopNavigation from '../components/inspect/TopNavigation.svelte';
  import Viewer from '../components/inspect/Viewer.svelte';
  import TreeView from '../components/overview/TreeView.svelte';
  import { breakpoints } from '../lib/breakpoints';
  import { ILoaderParams, loader, setLoaderContext } from '../lib/loader';
  import { startTour } from '../lib/tour';
  import {
    hasContent,
    isBurgerMenuShown,
    isLoading,
    isMobileViewerShown,
    noMetadata,
    primary,
    sourceManifestStore,
    urlParams,
  } from '../stores';

  let isDragging = false;
  let error = null;
  let tour: ReturnType<typeof startTour>;

  $: isUploadMode = !$hasContent || isDragging;

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
  onMount(() => {
    if (!$hasContent) {
      $goto('/inspect', $params);
    }
  });
</script>

<svelte:window />
<svelte:head>
  <title>{$_('page.title')}</title>
</svelte:head>
<main
  use:loader={loaderParams}
  use:breakpoints
  class="theme-light min-w-[var(--screen-width)] overflow-x-auto"
  class:no-content={!$hasContent}
  class:full-width={isUploadMode && !$sourceManifestStore && !error}>
  {#if $isBurgerMenuShown}
    <div
      transition:fade={{ duration: 200 }}
      class="menu-overlay"
      on:click={() => isBurgerMenuShown.update((shown) => !shown)} />
  {/if}
  <Header />
  {#if $hasContent}
    <TopNavigation
      node={$primary}
      noMetadata={$noMetadata}
      currentPage="overview" />
  {:else if error}
    <Viewer {isDragging} isError={!!error} />
  {/if}
  {#if $hasContent || error}
    {#if $isLoading}
      <div class="w-full h-full bg-gray-75 flex items-center justify-center">
        <CircleLoader />
      </div>
    {:else if !error}
      <TreeView />
    {/if}
    <section
      data-test-id="overview.right-col"
      class="right-col p-4 md:pt-4"
      class:loading={$isLoading}>
      <div class="wrapper">
        {#if error}
          <div class="w-full">
            <Alert severity="error">{$_(error)}</Alert>
          </div>
        {:else if $noMetadata}
          <ContentCredentialsError isComparing={false} />
        {:else if $primary}
          <About node={$primary} isMobileViewer={$isMobileViewerShown} />
        {:else if $isLoading}
          <div class="flex items-center justify-center">
            <CircleLoader />
          </div>
        {/if}
      </div>
    </section>
  {/if}
  <Footer />
</main>

<style lang="postcss">
  main {
    --mobile-overview-padding: 400px;
    --viewer-height: calc(100vh - var(--mobile-overview-padding));
    --cai-thumbnail-size: 48px;
    --cai-thumbnail-badge-icon-width: 16px;
    --cai-thumbnail-badge-icon-height: 16px;

    @apply grid w-screen min-h-screen h-screen font-base;
    grid-template-columns: 100%;
    grid-template-rows: 60px 114px var(--viewer-height) 1fr 70px;
    grid-template-areas:
      'header'
      'breadcrumb'
      'viewer'
      'right'
      'footer';
  }
  main.no-content {
    grid-template-rows: 80px 0 1fr 55px;
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
    @apply fixed inset-0 z-10;
    background-color: rgba(0, 0, 0, 0.2);
  }

  @screen lg {
    main {
      /* @apply fixed inset-0; */
      grid-template-columns: 1fr 320px;
      grid-template-rows: 60px 114px 1fr 55px;
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
