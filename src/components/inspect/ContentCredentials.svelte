<script lang="ts">
  import { onDestroy } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Asset from './Asset.svelte';
  import Button from '../Button.svelte';
  import OriginalCreation from './OriginalCreation.svelte';
  import {
    contentSourceIds,
    storeReport,
    primaryId,
    isCompareSelectMode,
  } from '../../stores';
  import { getAssetList, getBreadcrumbList } from '../../lib/claim';
  import type { IEnhancedClaimReport } from '../../lib/types';

  export let claim: IEnhancedClaimReport | null = null;
  export let source: ISourceInfo | null = null;
  let container: any;
  let secureCapture: false;

  $: assetList = claim ? getAssetList($storeReport, claim.id) : [];
  $: breadcrumbList = getBreadcrumbList($storeReport, $contentSourceIds);
  $: combined = [...breadcrumbList, ...assetList];

  onDestroy(() => isCompareSelectMode.set(false));
</script>

<div class="h-full relative">
  <div class="p-4 pb-1">
    <h2 class="my-0 mb-2">
      <span>{$_('comp.contentCredentials.title')}</span>
    </h2>
    <div class="mb-4 leading-small text-gray-700">
      {$_('comp.contentCredentials.subtitle')}
    </div>
  </div>
  <div class="relative pl-4">
    <div bind:this={container} class="grid space-y-4">
      {#each breadcrumbList as asset, index (asset.id)}
        <Asset
          {asset}
          isCompareSelectMode={$isCompareSelectMode}
          id={`record-${index}`}
          current={asset.id === $primaryId}
          hasConnector={index > 0} />
      {/each}
      <div class="grid space-y-4">
        {#each assetList as asset (asset.id)}
          <div>
            <Asset
              {asset}
              isCompareSelectMode={$isCompareSelectMode}
              indented />
          </div>
        {/each}
      </div>
    </div>
  </div>
  {#if secureCapture}
    <div class="mx-4">
      <OriginalCreation type="secureCapture" {claim} />
    </div>
  {/if}
  {#if combined.length > 1}
    <div
      class="sticky bottom-0 left-0 right-0 pb-4 pt-8 pointer-events-none flex justify-center w-full bg-gradient-to-t from-white via-white to-transparent">
      <div class="pointer-events-auto">
        <Button
          on:click={() => isCompareSelectMode.update((x) => !x)}
          secondary={!$isCompareSelectMode}
          >{$_('comp.contentCredentials.compare')}</Button>
      </div>
    </div>
  {/if}
  {#if source && !claim}
    <div class="relative pl-4">
      <div bind:this={container} class="grid space-y-4">
        <Asset {source} current={true} />
      </div>
    </div>
  {/if}
</div>
