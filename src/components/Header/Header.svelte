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
  import { _ } from 'svelte-i18n';
  import { sidebarMenuState } from '../../features/SidebarMenu';
  import Hamburger from '../Hamburger/Hamburger.svelte';
  import LargeTitle from '../typography/LargeTitle.svelte';

  function handleBurgerClick() {
    sidebarMenuState.toggle();
  }

  export let burgerOpen = false;
</script>

<header class="flex h-14 items-center px-2">
  <Hamburger on:click={handleBurgerClick} open={burgerOpen} />
  <LargeTitle><slot>{$_('page.home.title')}</slot></LargeTitle>
  <div class="ms-auto hidden md:block">
    <slot name="links" />
  </div>
</header>
