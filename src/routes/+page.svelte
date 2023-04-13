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
  import Header from '../components/Header/Header.svelte';
</script>

<Header />
<div class="flex grow items-center justify-center">
  <h1 class="w-[47.5rem] text-center text-[5rem]/tight font-black">
    {$_('page.home.cta')}
  </h1>
</div>
