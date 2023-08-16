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
  let showResponsiveInfoPanel = false;

  const { hierarchyView } = verifyStore;

  function togglePanel() {
    showResponsiveInfoPanel = !showResponsiveInfoPanel;
  }

  function testAsset(url: string) {
    verifyStore.readC2paSource(url);
  }
</script>

<div
  class="h-screen overflow-auto bg-gray-50 transition-transform sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
  class:-translate-y-full={showResponsiveInfoPanel}>
  <div class="flex h-20 items-center border-b-2 bg-gray-50 px-6 shadow">
    <BigAssetInfo
      thumbnail="https://verify.contentauthenticity.org/_app/immutable/assets/fake-news-2ec11861.jpg"
      {date}>
      <svelte:fragment slot="name">coucou.png</svelte:fragment></BigAssetInfo>
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
  <button
    class="m-2 bg-blue-600 p-2 text-white sm:hidden"
    on:click={togglePanel}>Hide</button>
</div>
