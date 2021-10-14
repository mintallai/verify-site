<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import partial from 'lodash/partial';
  import dragDrop from 'drag-drop';
  import { getSdk, Claim, Ingredient, Source } from '../lib/sdk';
  import { getBadgeProps } from '../lib/claim';
  import About from '../components/About.svelte';
  import TopNavigation from '../components/inspect/TopNavigation.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import CompareLatestButton from '../components/inspect/comparison/CompareLatestButton.svelte';
  import Thumbnail from '../components/Thumbnail.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import ContentCredentialsError from '../components/inspect/ContentCredentialsError.svelte';
  import TreeView from '../components/overview/TreeView.svelte';
  import { processFiles } from '../lib/file';
  import { startTour } from '../lib/tour';
  import {
    urlParams,
    provenance,
    setProvenance,
    navigateToPath,
    compareWithPath,
    primaryAsset,
    secondaryAsset,
    isBurgerMenuShown,
    isMobileViewerShown,
    isLoading,
    setIsLoading,
  } from '../stores';
  import type { ViewableItem } from '../lib/types';

  function handleClose(navigateToAsset: ViewableItem) {
    // TODO: Implement this
    // navigateToPath(navigateToAsset.id);
    compareWithPath(null);
  }

  let isDraggingOver = false;
  let error = false;
  let tour: ReturnType<typeof startTour>;
  let breakpoints = __breakpoints__;
  let mdBreakpoint = `(max-width: ${breakpoints.md})`;
  let lgBreakpoint = `(max-width: ${breakpoints.lg})`;

  $: source = $provenance?.source;
  $: sourceParam = $urlParams.source;
  $: hasContent = sourceParam || $provenance || $isLoading;
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
<svelte:head>
  <title>{$_('page.title')}</title>
</svelte:head>
<main class="theme-light">
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
    currentPage="overview"
    on:back={partial(handleClose, secondary)} />
  {#if hasContent}
    <TreeView />
    <section class="right-col p-4 pt-0 md:pt-4">
      {#if primary instanceof Claim}
        <div class="wrapper">
          <About claim={primary} {isComparing} {isMobileViewer} />
        </div>
      {:else if primary instanceof Ingredient}
        <div class="w-full flex justify-center">
          <div class="info w-full max-w-xs">
            <div>
              <dl class="attributes">
                <dt>
                  <div>{$_('comp.about.contentCredentials.header')}</div>
                  <cai-tooltip placement="left" class="theme-spectrum">
                    <div
                      slot="content"
                      class="text-gray-900"
                      style="width: 200px;">
                      {$_('comp.about.contentCredentials.helpText')}
                    </div>
                  </cai-tooltip>
                </dt>
                <dd class="flex space-x-2 items-center mt-1">
                  <div class="w-12 h-12">
                    <Thumbnail asset={primary} />
                  </div>
                  <div>
                    <h6>File name</h6>
                    <div>{primary.data.title}</div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      {/if}
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
  section.left-col {
    @apply hidden;
    grid-area: left;
  }
  section.right-col {
    @apply max-h-full;
    grid-area: right;
  }
  .menu-overlay {
    @apply fixed inset-0 z-20;
    background-color: rgba(0, 0, 0, 0.2);
  }
  @screen lg {
    main,
    main.comparing {
      @apply fixed inset-0;
      grid-template-columns: 1fr 320px;
      grid-template-rows: 80px 60px 1fr 55px;
      grid-template-areas:
        'header header'
        'breadcrumb breadcrumb'
        'viewer right'
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
