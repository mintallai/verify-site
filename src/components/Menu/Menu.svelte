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
  import { menu } from '../../store';
  import Header from '../Header/Header.svelte';
  import MenuItem from './MenuItem.svelte';

  export let open = false;

  function handleItemClick() {
    menu.close();
  }
</script>

{#if open}
  <div class="fixed top-0 h-screen w-screen bg-white">
    <Header />
    <div class="border-b-2">
      <MenuItem href="/" on:click={handleItemClick}>Home</MenuItem>
      <MenuItem href="/verify" on:click={handleItemClick}
        >Verify Content Credentials</MenuItem>
      <MenuItem href="/apply" on:click={handleItemClick}
        >Apply Content Credentials</MenuItem>
      <MenuItem href="/" on:click={handleItemClick}>FAQs</MenuItem>
      <MenuItem href="/" on:click={handleItemClick}
        >Learn more about content authenticity</MenuItem>
      <MenuItem href="/" on:click={handleItemClick}>Open-source tools</MenuItem>
    </div>
  </div>
{/if}
