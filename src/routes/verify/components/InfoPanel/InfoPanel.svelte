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
  import close from '$assets/svg/color/logos/close.svg';
  import Body from '$src/components/typography/Body.svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { fly } from 'svelte/transition';
  import { verifyStore } from '../../stores';
  import BigAssetInfo from '../AssetInfo/BigAssetInfo.svelte';
  import ThumbnailSection from '../Thumbnail/ThumbnailSection.svelte';
  import AboutSection from './AboutSection/AboutSection.svelte';
  import AdvancedSection from './AdvancedSection/AdvancedSection.svelte';
  import ContentSummarySection, {
    assetDataToProps as assetDataToContentSummaryProps,
  } from './ContentSummarySection/ContentSummarySection.svelte';
  import CreditAndUsage from './CreditAndUsageSection/CreditAndUsageSection.svelte';
  import ProcessSection from './ProcessSection/ProcessSection.svelte';

  export let showInfoPanel: boolean;
  const dispatch = createEventDispatcher();
  const { hierarchyView } = verifyStore;

  $: assetStore =
    $hierarchyView.state === 'success'
      ? $hierarchyView.selectedAssetStore
      : null;
  $: id = $assetStore?.id;
  $: ingredients =
    $hierarchyView.state === 'success' && id
      ? $hierarchyView.ingredientsForAssetId(id)
      : [];

  function togglePanel() {
    dispatch('isShown', {
      showInfoPanel: showInfoPanel,
    });
  }
</script>

<div
  class="z-10 h-screen overflow-auto bg-gray-50 transition-transform sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
  class:-translate-y-full={showInfoPanel}
  transition:fly={{ duration: 300, opacity: 0, x: 200 }}>
  {#if $assetStore}
    <div
      class="flex h-20 shrink-0 items-center justify-between border-b-2 bg-gray-50 px-6 shadow">
      <BigAssetInfo
        date={$assetStore.manifestData?.date}
        thumbnail={$assetStore.thumbnail}>
        <svelte:fragment slot="name">{$assetStore.title}</svelte:fragment
        ></BigAssetInfo>
      <button on:click={togglePanel}>
        <img
          src={close}
          class="h-[1.15rem] w-[1.15rem] md:hidden"
          alt={$_('sidebar.verify.hideInfo')} /></button>
    </div>
    <ThumbnailSection thumbnail={$assetStore.thumbnail} />
    {#if $assetStore.manifestData}
      <ContentSummarySection {...assetDataToContentSummaryProps($assetStore)} />
      <CreditAndUsage manifestData={$assetStore.manifestData} />
      <ProcessSection manifestData={$assetStore.manifestData} {ingredients} />
      <AboutSection manifestData={$assetStore.manifestData} />
      <AdvancedSection />
    {:else}
      <div class="p-5"><Body>{$_('sidebar.verify.noCCFile')}</Body></div>
    {/if}
  {/if}
</div>
