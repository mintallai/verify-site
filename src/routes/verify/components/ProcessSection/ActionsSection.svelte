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
  import producer from '../../../../../assets/svg/color/logos/producer.svg';
  import IconContentRow from '../../components/IconContentRow/IconContentRow.svelte';
  import SubSection from '../../components/SubSection/SubSection.svelte';
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.actions')}</svelte:fragment>
  <div slot="content">
    <IconContentRow>
      <img slot="icon" src={producer} alt={producer} class="mr-2 w-4" />
      <div slot="content" class="flex flex-col">
        <span>Color or exposure edits</span>
        <span class="text-gray-600"
          >Adjusted properties like tone, saturation, curves, shadows or
          highlights</span>
      </div></IconContentRow>
  </div></SubSection>
