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
  import AiSubSection from './AISubSection.svelte';
  import ProducerSubSection from './ProducerSubSection.svelte';
  import SocialSubSection from './SocialSubSection.svelte';

  export let assetData: AssetData;
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">{$_('sidebar.credit')}</svelte:fragment>
  <svelte:fragment slot="description">
    {$_('sidebar.verify.credit.description')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#if assetData.producer}
      <ProducerSubSection producer={assetData.producer} />
    {/if}
    {#if assetData.socialAccounts?.length}
      <SocialSubSection socialAccounts={assetData.socialAccounts} />
    {/if}
    {#if assetData.generativeInfo?.softwareAgents?.length}
      <AiSubSection softwareAgents={assetData.generativeInfo.softwareAgents} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
