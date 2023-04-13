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

<script>
  import Header from '../Header/Header.svelte';
</script>

<div class="flex grow">
  <div class="basis-80 border-e-2">
    <Header><slot name="header" /></Header>
    <div class="border-t-2">
      <slot name="sidebar" />
    </div>
  </div>
  <div class="grow">
    <slot name="content" />
  </div>
</div>
