<script lang="ts">
  import partial from 'lodash/partial';
  import Header from '../components/Header.svelte';
  import Assets from '../components/Assets.svelte';
  import NoInfo from '../components/NoInfo.svelte';
  import ContentSources from '../components/ContentSources.svelte';
  import About from '../components/About.svelte';
  import Comparison from '../components/Comparison.svelte';
  import Viewer from '../components/Viewer.svelte';
  import {
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
</style>

<main>
  <Header />
  {#if primary}
    <section class="border-r">
      {#if primary?.type === 'claim'}
        <About
          claim={primary}
          {isComparing}
          on:close={partial(handleClose, secondary)} />
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
        <About
          claim={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if secondary?.type === 'reference'}
        <NoInfo
          ingredient={secondary}
          {isComparing}
          on:close={partial(handleClose, primary)} />
      {:else if primary?.type === 'claim'}
        <Assets claim={primary} />
      {/if}
    </section>
  {/if}
</main>
