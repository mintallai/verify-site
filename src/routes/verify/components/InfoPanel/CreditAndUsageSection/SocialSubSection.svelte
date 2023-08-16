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
  import ProviderIcon from '../../../../../components/ProviderIcon/ProviderIcon.svelte';
  import SocialMediaInfo from '../../../../../components/SocialMediaInfo/SocialMediaInfo.svelte';
  import IconContentRow from '../../IconContentRow/IconContentRow.svelte';
  import SubSection from '../../SubSection/SubSection.svelte';
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.credit.social')}</svelte:fragment>
  <svelte:fragment slot="content">
    <IconContentRow>
      <div class="pe-2" slot="icon">
        <ProviderIcon provider="behance.net" />
      </div>
      <span slot="content">
        <SocialMediaInfo
          link="https://www.behance.net/"
          username="@janesmith"
          appName="behance" />
      </span>
    </IconContentRow>
    <IconContentRow>
      <div class="pe-2" slot="icon">
        <ProviderIcon provider="instagram.com" />
      </div>
      <SocialMediaInfo
        slot="content"
        link="https://www.instagram.com/"
        username="@janesmith"
        appName="Instagram" />
    </IconContentRow>
  </svelte:fragment></SubSection>
