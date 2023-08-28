<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
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
  import { sidebarMenuState } from '$src/features/SidebarMenu';
  import { _ } from 'svelte-i18n';
  import Hamburger from '../Hamburger/Hamburger.svelte';
  import Title from '../typography/Title.svelte';

  function handleBurgerClick() {
    sidebarMenuState.toggle();
  }

  export let burgerOpen = false;
</script>

<header class="flex h-header items-center px-2">
  <Hamburger on:click={handleBurgerClick} open={burgerOpen} />
  <Title><slot>{$_('page.home.title')}</slot></Title>
  <div class="ms-auto hidden md:block">
    <slot name="links" />
  </div>
</header>
