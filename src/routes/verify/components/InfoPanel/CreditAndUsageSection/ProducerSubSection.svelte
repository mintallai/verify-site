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
  import producer from '../../../../../../assets/svg/color/logos/producer.svg';
  import IconContentRow from '../../IconContentRow/IconContentRow.svelte';
  import SubSection from '../../SubSection/SubSection.svelte';
</script>

<SubSection
  ><svelte:fragment slot="title">
    {$_('sidebar.verify.credit.producer')}
  </svelte:fragment>
  <IconContentRow slot="content">
    <img slot="icon" src={producer} alt={producer} class="mr-2 w-4" />
    <svelte:fragment slot="content">Jane Smith</svelte:fragment>
  </IconContentRow>
</SubSection>
