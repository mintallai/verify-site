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
  import help from '../../../../../../assets/svg/color/logos/help.svg';
  import Link from '../../../../../components/typography/Link.svelte';
  import ManifestTooltip from './ManifestTooltip.svelte';
  let showTooltip = false;
</script>

<div class="flex flex-col pb-1 pt-6">
  <div class="flex justify-between">
    <button><Link>{$_('sidebar.verify.search')}</Link></button>
    <button on:click={() => (showTooltip = !showTooltip)}
      ><img
        src={help}
        alt={$_('sidebar.verify.search.tooltip.help')} /></button>
  </div>
  {#if showTooltip}
    <ManifestTooltip bind:showTooltip />
  {/if}
</div>
