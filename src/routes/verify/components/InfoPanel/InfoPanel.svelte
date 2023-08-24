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
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import close from '../../../../../assets/svg/color/logos/close.svg';
  import { verifyStore } from '../../stores';
  import AssetInfo from '../AssetInfo.svelte';
  import BigAssetInfo from '../AssetInfo/BigAssetInfo.svelte';
  import ThumbnailSection from '../Thumbnail/ThumbnailSection.svelte';
  import AboutSection from './AboutSection/AboutSection.svelte';
  import AdvancedSection from './AdvancedSection/AdvancedSection.svelte';
  import ContentSummarySection from './ContentSummarySection/ContentSummarySection.svelte';
  import CreditAndUsage from './CreditAndUsageSection/CreditAndUsageSection.svelte';
  import ProcessSection from './ProcessSection/ProcessSection.svelte';

  let date: Date = new Date('2019-01-16');
  export let showInfoPanel: boolean;
  const dispatch = createEventDispatcher();
  const { hierarchyView } = verifyStore;

  function testAsset(url: string) {
    verifyStore.readC2paSource(url);
  }

  function togglePanel() {
    dispatch('isShown', {
      showInfoPanel: showInfoPanel,
    });
  }
</script>

<div
  class="h-screen overflow-auto bg-gray-50 transition-transform sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
  class:-translate-y-full={showInfoPanel}>
  <div
    class="flex h-20 shrink-0 items-center justify-between border-b-2 bg-gray-50 px-6 shadow">
    <BigAssetInfo
      {date}
      thumbnail="https://verify.contentauthenticity.org/_app/immutable/assets/fake-news-2ec11861.jpg">
      <svelte:fragment slot="name">coucou.png</svelte:fragment></BigAssetInfo>
    {#if showInfoPanel}
      <button on:click={togglePanel}>
        <img
          src={close}
          class="h-[1.15rem] w-[1.15rem] md:hidden"
          alt={$_('sidebar.verify.hideInfo')} /></button>
    {/if}
  </div>
  <ThumbnailSection
    thumbnail="https://verify.contentauthenticity.org/_app/immutable/assets/fake-news-2ec11861.jpg" />
  <ContentSummarySection />
  <CreditAndUsage />
  <ProcessSection />
  <AboutSection />
  <AdvancedSection />
  {#if $hierarchyView.state === 'success'}
    <AssetInfo assetStore={$hierarchyView.selectedAssetStore} />
  {/if}
  <button
    class="m-2 bg-blue-600 p-2 text-white"
    on:click={() => testAsset('http://localhost:3000/XCA.jpg')}
    >Load asset</button>
  <button
    class="m-2 bg-blue-600 p-2 text-white"
    on:click={() => testAsset('http://localhost:3000/CAICAI.jpg')}
    >Load asset 2</button>
</div>
