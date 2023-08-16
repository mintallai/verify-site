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
  import Section from '../../../../../components/SidebarSection/Section.svelte';
  import BodyBold from '../../../../../components/typography/BodyBold.svelte';
  import Link from '../../../../../components/typography/Link.svelte';
</script>

<Section>
  <BodyBold slot="title">{$_('sidebar.verify.advanced')}</BodyBold>
  <Link slot="content">{$_('sidebar.verify.advanced.show')}</Link>
</Section>
