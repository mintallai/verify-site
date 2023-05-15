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
  import Header from '../../components/Header/Header.svelte';
  import MenuItem from './SidebarMenuItem.svelte';
  import MenuSection from './SidebarMenuSection.svelte';
  import { sidebarMenuState } from './store/sidebarMenuState';
</script>

<div
  class="fixed top-0 h-screen w-sidebar border-e-2 bg-white shadow transition"
  class:-translate-x-full={!$sidebarMenuState}>
  <Header burgerOpen={true} />
  <div class="border-t-2 py-4">
    <MenuSection>
      <MenuItem href="/">{$_('menu.home')}</MenuItem>
    </MenuSection>
    <MenuSection title={$_('menu.section.overview')}>
      <MenuItem href="/">
        {$_('menu.section.overview.what')}
      </MenuItem>
    </MenuSection>
    <MenuSection title={$_('menu.section.features')}>
      <MenuItem href="/verify">
        {$_('menu.section.features.verify')}
      </MenuItem>
      <MenuItem href="/apply">
        {$_('menu.section.features.apply')}
      </MenuItem>
      <MenuItem href="/">
        {$_('menu.section.features.embed')}
      </MenuItem>
    </MenuSection>
    <MenuSection title={$_('menu.section.getInvolved')}>
      <MenuItem href="/">
        {$_('menu.section.getInvolved.CAI')}
      </MenuItem>
      <MenuItem href="/">
        {$_('menu.section.getInvolved.OSS')}
      </MenuItem>
      <MenuItem href="/">
        {$_('menu.section.getInvolved.discord')}
      </MenuItem>
      <MenuItem href="/">
        {$_('menu.section.getInvolved.github')}
      </MenuItem>
    </MenuSection>
  </div>
</div>
