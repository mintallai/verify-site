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
  import { _ } from 'svelte-i18n';
  import Button from '../../Button.svelte';
  import { rootId, compareWithPath } from '../../../stores';
  import type { Claim } from '../../../lib/sdk';

  export let claim: Claim;
  export let isComparing: boolean = false;
</script>

{#if !isComparing && claim?.id !== $rootId}
  <div class="w-full py-5 mt-4 border-t border-gray-300">
    <Button full on:click={() => compareWithPath([$rootId])}
      >{$_('comp.comparison.compareToLatestVersion')}</Button>
  </div>
{/if}
