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
  import SidebarLayout from '../../features/SidebarLayout/SidebarLayout.svelte';
</script>

<SidebarLayout>
  <div slot="header">{$_('page.verify.title')}</div>
  <div slot="sidebar">SIDEBAR</div>
  <div slot="content">CONTENT</div>
</SidebarLayout>
