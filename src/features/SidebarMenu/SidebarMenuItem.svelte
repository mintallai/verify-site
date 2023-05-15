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
  import Title from '../../components/typography/Title.svelte';
  import { sidebarMenuState } from './store/sidebarMenuState';

  export let href = '';

  function handleClick() {
    sidebarMenuState.setClosed();
  }
</script>

<a
  {href}
  on:click={handleClick}
  class="text-lg/6 block px-7 py-2.5 font-extrabold hover:bg-blue-100 focus:bg-blue-100">
  <Title><slot /></Title>
</a>
