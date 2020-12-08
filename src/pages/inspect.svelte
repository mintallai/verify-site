<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import partial from 'lodash/partial';
  import dragDrop from 'drag-drop';
  import Mousetrap from 'mousetrap';
  import {
    getSummaryFromFile,
    getSummaryFromUrl,
    ToolkitError,
  } from '../lib/toolkit';
  import About from '../components/About.svelte';
  import Alert from '../components/Alert.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import Header from '../components/Header.svelte';
  import ContentSources from '../components/inspect/ContentSources.svelte';
  import Icon from '../components/Icon.svelte';
  import NoInfo from '../components/inspect/NoInfo.svelte';
  import Comparison from '../components/inspect/Comparison.svelte';
  import DragOverlay from '../components/inspect/DragOverlay.svelte';
  import Viewer from '../components/inspect/Viewer.svelte';
  import { startTour } from '../lib/tour';
  import {
    summary,
    setSummary,
    navigateToId,
    secondaryId,
    primaryAsset,
    secondaryAsset,
    learnMoreUrl,
  } from '../stores';
  import { getIdentifier } from '../lib/claim';

  function handleClose(navigateToAsset: ViewableItem) {
    navigateToId(getIdentifier(navigateToAsset));
    secondaryId.set('');
  }

  let allowDragDrop = false;
  let isDraggingOver = false;
  let error: ToolkitError;
  let tour: ReturnType<typeof startTour>;
  let winW = 0;
  let winH = 0;

  $: isLoading = $summary === null;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);
  $: showMobileOverlay = winW < 1024 || winH < 400;
  $: {
    // Cancel the tour if the overlay is showing
    if (tour && tour.isActive() && showMobileOverlay) {
      tour.cancel();
    }
  }

  onMount(async () => {
    const params = new URLSearchParams(window.location.search?.substr(1));
    const source = params.get('source');
    const tourFlag = params.get('tour');
    const forceTour = params.get('forceTour');
    if (source) {
      try {
        const data = await getSummaryFromUrl(source);
        window.newrelic?.setCustomAttribute('source', source);
        setSummary(data);
        if (!showMobileOverlay) {
          tour = startTour({
            summary: $summary,
            start: tourFlag,
            force: forceTour,
          });
        }
      } catch (err) {
        error = err;
      }
    } else {
      window.location.assign($learnMoreUrl);
    }

    const keyCommand = 'ctrl+shift+d';
    Mousetrap.bind(keyCommand, () => {
      allowDragDrop = !allowDragDrop;
      console.log('Drag and drop enabled set to', allowDragDrop);
    });

    const cleanupDragDrop = dragDrop('main', {
      async onDrop(files: File[]) {
        if (allowDragDrop && files.length) {
          const data = await getSummaryFromFile(files[0]);
          setSummary(data);
        }
      },
      onDragOver() {
        if (allowDragDrop) isDraggingOver = true;
      },
      onDragLeave() {
        if (allowDragDrop) isDraggingOver = false;
      },
    });
    return () => {
      Mousetrap.unbind(keyCommand);
      cleanupDragDrop();
    };
  });
</script>

<style lang="postcss">
  main {
    @apply grid absolute w-screen h-screen font-body;
    grid-template-columns: 320px auto 320px;
    grid-template-rows: 80px auto 55px;
  }
  section {
    @apply col-span-1 border-gray-200 max-h-full overflow-auto;
  }
  section.loading {
    @apply flex items-center justify-center;
  }
  footer {
    @apply col-span-3 flex justify-center items-center text-xs border-t border-gray-200;
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
    @apply flex flex-col justify-center items-center text-center text-xl leading-snug;
    max-width: 354px;
  }
</style>

<svelte:window bind:innerWidth={winW} bind:innerHeight={winH} />
<main>
  {#if showMobileOverlay}
    <div transition:fade={{ duration: 500 }} class="mobile-overlay">
      <div class="content">
        <Icon
          size="3xl"
          name="workflow:DeviceDesktop"
          class="text-purple-500 mb-3" />
        <div>
          Increase the size of your browser window to view. If you’re on a
          mobile device, open this page on a computer.
        </div>
      </div>
    </div>
  {/if}
  {#if isDraggingOver}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 z-20 pointer-events-none">
      <DragOverlay />
    </div>
  {/if}
  <Header {allowDragDrop} />
  {#if error}
    <section class="border-r" class:loading={isLoading} />
    <Viewer />
    <section class="border-l p-4">
      <Alert severity="error" message="Sorry, something went wrong" />
    </section>
  {:else if isLoading}
    <section class="border-r" class:loading={isLoading}>
      <CircleLoader />
    </section>
    <Viewer isLoading={true} />
    <section class="border-l" class:loading={isLoading}>
      <CircleLoader />
    </section>
  {:else if primary}
    <section class="border-r p-4">
      {#if !isComparing}
        <ContentSources />
      {:else if primary?.type === 'claim'}
        <About
          claim={primary}
          {isComparing}
          on:close={partial(handleClose, secondary)} />
      {:else if primary?.type === 'reference'}
        <NoInfo
          ingredient={primary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {/if}
    </section>
    {#if isComparing}
      <Comparison {primary} {secondary} />
    {:else}
      <Viewer thumbnailURL={primary.thumbnail_url} />
    {/if}
    <section class="border-l p-4">
      {#if !isComparing && primary?.type === 'claim'}
        <About
          claim={primary}
          {isComparing}
          on:close={partial(handleClose, secondary)} />
      {:else if !isComparing && primary?.type === 'reference'}
        <NoInfo
          ingredient={primary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if secondary?.type === 'claim'}
        <About
          claim={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if secondary?.type === 'reference'}
        <NoInfo
          ingredient={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {/if}
    </section>
  {/if}
  <footer>
    <span>© __year__ Adobe</span>
    <a href="https://www.adobe.com/privacy.html" target="_blank">Privacy</a>
    <a href="https://www.adobe.com/legal/terms.html" target="_blank">Terms of
      use</a>
    <a href="https://contentauthenticity.org/contact" target="_blank">Contact us</a>
  </footer>
</main>
