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
  import type { ILoaderParams } from '$lib/loader';
  import { loader, setLoaderContext } from '$lib/loader';
  import { _ } from 'svelte-i18n';
  import About from '../../components/About.svelte';
  import Alert from '../../components/Alert.svelte';
  import CircleLoader from '../../components/CircleLoader.svelte';
  import Footer from '../../components/Footer.svelte';
  import Header from '../../components/Header.svelte';
  import Comparison from '../../components/inspect/Comparison.svelte';
  import ContentCredentialsError from '../../components/inspect/ContentCredentialsError.svelte';
  import Navigation from '../../components/inspect/Navigation.svelte';
  import TopNavigation from '../../components/inspect/TopNavigation.svelte';
  import Viewer from '../../components/inspect/Viewer.svelte';
  import {
    compareWith,
    hasContent,
    isComparing,
    isLoading,
    noMetadata,
    primary,
    secondary,
    sourceManifestStore,
  } from '../../stores';

  function handleClose() {
    compareWith(null);
  }

  let isDragging = false;
  let error = null;

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

  $: {
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
  class="theme-light min-w-[var(--screen-width)] overflow-x-auto"
  class:no-content={!$hasContent}
  class:comparing={$isComparing}
  class:error>
  <Header />
  {#if $hasContent}
    <TopNavigation isComparing={$isComparing} on:back={handleClose} />
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
        <Navigation />
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
            <About node={$primary} />
          </div>
        {:else}
          <Navigation />
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
          <About node={$secondary} />
        {:else}
          <div class="wrapper">
            <About node={$primary} />
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
  main.comparing {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 80px 60px var(--viewer-height) 1fr auto;
    grid-template-areas:
      'header header'
      'breadcrumb breadcrumb'
      'viewer viewer'
      'left right'
      'footer footer';
  }
  main.error {
    grid-template-columns: 1fr 320px;
    grid-template-rows: 60px 114px 1fr auto;
    grid-template-areas:
      'header header'
      'breadcrumb breadcrumb'
      'viewer right'
      'footer footer';
  }

  main.comparing section.left-col {
    @apply w-full h-full flex align-middle justify-center;
  }

  @screen lg {
    main,
    main.comparing {
      /* @apply fixed inset-0; */
      grid-template-columns: 320px 1fr 320px;
      grid-template-rows: 60px 114px 1fr auto;
      grid-template-areas:
        'header header header'
        'breadcrumb breadcrumb breadcrumb'
        'left viewer right'
        'footer footer footer';
    }

    main.no-content {
      grid-template-rows: 80px 0 1fr auto;
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
