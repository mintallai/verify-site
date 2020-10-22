<script lang="ts">
  import { fade } from 'svelte/transition';
  import partial from 'lodash/partial';
  import About from '../components/About.svelte';
  import CircleLoader from '../components/CircleLoader.svelte';
  import Header from '../components/Header.svelte';
  import ContentSources from '../components/view/ContentSources.svelte';
  import Assets from '../components/view/Assets.svelte';
  import NoInfo from '../components/view/NoInfo.svelte';
  import Comparison from '../components/view/Comparison.svelte';
  import Viewer from '../components/view/Viewer.svelte';
  import {
    summary,
    navigateToId,
    secondaryId,
    primaryAsset,
    secondaryAsset,
  } from '../stores';
  import { getIdentifier } from '../lib/claim';

  function handleClose(navigateToAsset: ViewableItem) {
    navigateToId(getIdentifier(navigateToAsset));
    secondaryId.set('');
  }

  $: isLoading = $summary === null;
  $: primary = $primaryAsset;
  $: secondary = $secondaryAsset;
  $: isComparing = !!(primary && secondary);
</script>

<style lang="postcss">
  main {
    @apply grid absolute w-screen h-screen font-body;
    grid-template-columns: 320px auto 320px;
    grid-template-rows: 80px auto;
  }
  section {
    @apply col-span-1 border-gray-200 max-h-full overflow-auto;
  }
  section.loading {
    @apply flex items-center justify-center;
  }
</style>

<main>
  <Header />
  {#if isLoading}
    <section class="border-r" class:loading={isLoading}>
      <CircleLoader />
    </section>
    <Viewer isLoading={true} />
    <section class="border-l" class:loading={isLoading}>
      <CircleLoader />
    </section>
  {:else if primary}
    <section class="border-r">
      {#if primary?.type === 'claim'}
        <div class="p-4">
          <About
            claim={primary}
            {isComparing}
            on:close={partial(handleClose, secondary)} />
        </div>
      {:else}
        <NoInfo
          ingredient={primary}
          {isComparing}
          on:close={partial(handleClose, secondary)} />
      {/if}
    </section>
    {#if isComparing}
      <Comparison
        primaryURL={primary.thumbnail_url}
        secondaryURL={secondary.thumbnail_url} />
    {:else}
      <Viewer thumbnailURL={primary.thumbnail_url} />
    {/if}
    <section class="border-l">
      {#if !isComparing}
        <ContentSources />
      {/if}
      {#if secondary?.type === 'claim'}
        <div class="p-4">
          <About
            claim={secondary}
            {isComparing}
            on:close={partial(handleClose, primary)} />
        </div>
      {:else if secondary?.type === 'reference'}
        <NoInfo
          ingredient={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if primary?.type === 'claim'}
        <div in:fade|local={{ duration: 200 }}>
          <Assets claim={primary} />
        </div>
      {/if}
    </section>
  {/if}
</main>
