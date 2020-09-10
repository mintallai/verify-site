<script lang="ts">
  import partial from 'lodash/partial';
  import Header from '../components/Header.svelte';
  import Assets from '../components/Assets.svelte';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Attribution from '../components/Attribution.svelte';
  import Comparison from '../components/Comparison.svelte';
  import Viewer from '../components/Viewer.svelte';
  import {
    navigateToId,
    secondaryId,
    primaryAsset,
    secondaryAsset,
  } from '../stores';
  import { getIdentifier } from '../lib/claim';

  function handleClose(navigateToAsset) {
    navigateToId(getIdentifier(navigateToAsset));
    secondaryId.set('');
  }

  $: {
    console.log('$primaryAsset', $primaryAsset);
    console.log('$secondaryAsset', $secondaryAsset);
  }

  $: isComparing = !!($primaryAsset && $secondaryAsset);
  $: primaryClaim =
    $primaryAsset?.type === 'claim' ? ($primaryAsset as IClaimSummary) : null;
  $: secondaryClaim =
    $secondaryAsset?.type === 'claim'
      ? ($secondaryAsset as IClaimSummary)
      : null;
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
  {#if $primaryAsset}
    <section class="border-r">
      {#if primaryClaim}
        <Attribution
          claim={primaryClaim}
          {isComparing}
          on:close={partial(handleClose, $secondaryAsset)} />
      {/if}
    </section>
    {#if isComparing}
      <Comparison
        primaryURL={$primaryAsset.thumbnail_url}
        secondaryURL={$secondaryAsset.thumbnail_url} />
    {:else}
      <Viewer thumbnailURL={$primaryAsset.thumbnail_url} />
    {/if}
    <section class="border-l">
      {#if !isComparing}
        <Breadcrumbs />
      {/if}
      {#if secondaryClaim}
        <Attribution
          claim={secondaryClaim}
          {isComparing}
          on:close={partial(handleClose, $primaryAsset)} />
      {:else if primaryClaim}
        <Assets claim={primaryClaim} />
      {/if}
    </section>
  {/if}
</main>
