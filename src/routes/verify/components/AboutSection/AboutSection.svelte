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
  import { _ } from 'svelte-i18n';
  import CollapsibleSection from '../../../../components/SidebarSection/CollapsibleSection.svelte';
  import IssuedBySection from './IssuedBySection.svelte';
  import IssuedOnSection from './IssuedOnSection.svelte';
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">
    {$_('sidebar.verify.about')}</svelte:fragment>
  <div slot="content">
    <IssuedBySection />
    <IssuedOnSection />
  </div>
</CollapsibleSection>
