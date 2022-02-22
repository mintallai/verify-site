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
  import cssVars from 'svelte-css-vars';
  export let ratio: number = 1;
</script>

<div class="aspect-box" use:cssVars={{ ratio }}>
  <slot />
</div>

<style lang="postcss">
  .aspect-box {
    @apply flex items-stretch;
  }
  .aspect-box::before {
    content: '';
    width: 1px;
    margin-left: -1px;
    float: left;
    height: 0;
    padding-top: calc((var(--ratio)) * 100%);
  }
  .aspect-box::after {
    content: '';
    display: table;
    clear: both;
  }
</style>
