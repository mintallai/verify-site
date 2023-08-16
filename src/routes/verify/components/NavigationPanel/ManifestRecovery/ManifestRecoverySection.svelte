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
  import ClosedBorderSection from '../../../../../components/SidebarSection/ClosedBorderSection.svelte';
  import SmallAssetInfo from '../../AssetInfo/SmallAssetInfo.svelte';
  import SearchforMatches from './SearchforMatches.svelte';
  let date: Date = new Date('2019-01-16');
</script>

<ClosedBorderSection>
  <div slot="title" class="pb-2">
    {$_('sidebar.verify.title')}
  </div>
  <svelte:fragment slot="content">
    <SmallAssetInfo
      thumbnail="https://verify.contentauthenticity.org/_app/immutable/assets/fake-news-2ec11861.jpg"
      {date}>
      <svelte:fragment slot="name">coucou.png</svelte:fragment></SmallAssetInfo>
    <SearchforMatches />
  </svelte:fragment>
</ClosedBorderSection>
