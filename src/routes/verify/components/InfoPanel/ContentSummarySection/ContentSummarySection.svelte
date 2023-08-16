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
  import info from '../../../../../../assets/svg/color/logos/info.svg';
  import Section from '../../../../../components/SidebarSection/Section.svelte';
  import BodyBold from '../../../../../components/typography/BodyBold.svelte';
  import Description from '../../../../../components/typography/Description.svelte';
</script>

<Section>
  <BodyBold slot="title">{$_('sidebar.verify.summary')}</BodyBold>
  <div class="flex" slot="content">
    <img src={info} alt="" class="self-start pe-2" />
    <Description
      >This content was output with digital tools. It has edit or activity
      history.</Description>
  </div>
</Section>
