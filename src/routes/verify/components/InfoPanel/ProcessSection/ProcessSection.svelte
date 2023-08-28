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
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import ActionsSection from './ActionsSection.svelte';
  import AppDeviceSection from './AppDeviceSection.svelte';
  import IngredientsSection from './IngredientsSection.svelte';

  export let assetData: AssetData;
  export let ingredients: AssetData[];
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">
    {$_('sidebar.process')}</svelte:fragment>
  <svelte:fragment slot="description">
    {$_('sidebar.verify.process.description')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#if assetData.claimGenerator}
      <AppDeviceSection generator={assetData.claimGenerator} />
    {/if}
    {#if assetData.editsAndActivity?.length}
      <ActionsSection
        editsAndActivity={assetData.editsAndActivity}
        reviewRatings={assetData.reviewRatings} />
    {/if}
    {#if ingredients.length}
      <IngredientsSection {ingredients} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
