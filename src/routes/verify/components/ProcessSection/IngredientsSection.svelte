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
  import AssetInfo from '../../components/AssetInfo/AssetInfo.svelte';
  import SubSection from '../../components/SubSection/SubSection.svelte';
  let date: Date = new Date('2019-01-16');
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.ingredients')}</svelte:fragment>
  <div slot="content">
    <AssetInfo
      thumbnail="https://verify.contentauthenticity.org/_app/immutable/assets/fake-news-2ec11861.jpg"
      {date}><div slot="name">coucou.png</div></AssetInfo>
  </div></SubSection>
