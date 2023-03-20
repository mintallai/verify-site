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
  import { goto } from '$app/navigation';
  import type { ILoaderParams } from '$lib/loader';
  import { loader, setLoaderContext } from '$lib/loader';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import About from '../../components/About.svelte';
  import Alert from '../../components/Alert.svelte';
  import CircleLoader from '../../components/CircleLoader.svelte';
  import Footer from '../../components/Footer.svelte';
  import Header from '../../components/Header.svelte';
  import ContentCredentialsError from '../../components/inspect/ContentCredentialsError.svelte';
  import TopNavigation from '../../components/inspect/TopNavigation.svelte';
  import Viewer from '../../components/inspect/Viewer.svelte';
  import TreeView from '../../components/overview/TreeView.svelte';
  import {
    hasContent,
    isLoading,
    noMetadata,
    primary,
    sourceManifestStore,
  } from '../../stores';

  let isDragging = false;
  let error = null;

  $: isUploadMode = !$hasContent || isDragging;

  $: {
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
    },
    onDragStateChange(newState: boolean) {
      isDragging = newState;
    },
  };
  setLoaderContext(loaderParams);
  onMount(() => {
    if (!$hasContent) {
      goto(`/inspect${location.search}`);
    }
  });
</script>

<svelte:window />
<svelte:head>
  <title>{$_('page.title')}</title>
</svelte:head>
<main
  use:loader={loaderParams}
  class="theme-light min-w-[var(--screen-width)] overflow-auto max-h-screen"
  class:no-content={!$hasContent}
  class:full-width={isUploadMode && !$sourceManifestStore && !error}>
  <Header />
  {#if $hasContent}
    <TopNavigation />
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
          <About node={$primary} />
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
    grid-template-rows: 80px 0 1fr auto;
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

  @screen lg {
    main {
      /* @apply fixed inset-0; */
      grid-template-columns: 1fr 320px;
      grid-template-rows: 60px 114px 1fr auto;
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

    section.right-col {
      @apply border-l-2;
    }

    section.right-col > .wrapper {
      @apply w-full h-full flex align-middle justify-center;
    }
  }
</style>
