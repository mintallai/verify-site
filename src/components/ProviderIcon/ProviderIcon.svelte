<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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
  import { providerInfoFromSocialId } from '$lib/providers';
  import type { ComponentType } from 'svelte';

  export let provider: string;
  export let fallbackIcon: ComponentType | null = null;
  let className = '';

  $: iconComponent =
    providerInfoFromSocialId(provider?.toString() ?? '')?.icon ?? fallbackIcon;

  export { className as class };
</script>

{#if iconComponent}
  <div class={`h-4 w-4 ${className}`}>
    <svelte:component this={iconComponent} width="16" height="16" />
  </div>
{/if}
