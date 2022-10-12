<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
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
  import { goto, params, url } from '@roxi/routify';
  import { style } from 'd3-selection';
  import { locale, _ } from 'svelte-i18n';
  import InspectIcon from '../../assets/svg/monochrome/inspect.svg';
  import OverviewIcon from '../../assets/svg/monochrome/overview.svg';
  import { hierarchy } from '../stores';
  export let inInspect: boolean;
  export let inOverview: boolean;
</script>

<sp-theme color="lightest" scale="medium">
  <div class="flex">
    {#if inOverview}
      <div
        class="container1Selected inline-block "
        class:disabled={!$hierarchy?.children}>
        <sp-button
          disabled={!$hierarchy?.children}
          on:click={$goto('/overview')}
          data-test-id="overview.btn">
          <div class="flex">
            <OverviewIcon class="h-4 w-4 mr-2" />
            {$_('comp.topNavigation.overview')}
          </div>
        </sp-button>
      </div>
    {:else}
      <div
        class="container1 inline-block"
        class:disabled={!$hierarchy?.children}>
        <sp-button
          disabled={!$hierarchy?.children}
          on:click={$goto('/overview')}
          data-test-id="overview.btn">
          <div class="flex">
            <OverviewIcon class="h-4 w-4 mr-2" />
            {$_('comp.topNavigation.overview')}
          </div>
        </sp-button>
      </div>
    {/if}
    {#if inInspect}
      <div class="container2Selected inline-block">
        <sp-button on:click={$goto('/inspect')}>
          <div class="flex">
            <InspectIcon class="h-4 w-4 mr-2" />
            {$_('comp.topNavigation.inspect')}
          </div>
        </sp-button>
      </div>
    {:else}
      <div class="container2 inline-block">
        <sp-button on:click={$goto('/inspect')}>
          <div class="flex">
            <InspectIcon class="h-4 w-4 mr-2" />
            {$_('comp.topNavigation.inspect')}
          </div>
        </sp-button>
      </div>
    {/if}
  </div></sp-theme>

<style lang="postcss">
  .container1 > sp-button {
    @apply text-gray-900 w-[100px] rounded-tr-none rounded-br-none rounded-tl-lg rounded-bl-lg bg-gray-50 border border-r-0 border-gray-500;
  }
  .container1Selected > sp-button {
    @apply text-white w-[100px] rounded-tr-none rounded-br-none rounded-tl-lg rounded-bl-lg bg-gray-700 border border-r-0 border-gray-400;
  }
  .container1 > sp-button:hover {
    @apply bg-gray-300 text-black;
  }
  .container2 > sp-button:hover {
    @apply bg-gray-300 text-black;
  }
  .container2 > sp-button {
    @apply text-gray-900 w-[100px] rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none bg-gray-50 border border-gray-500;
  }
  .container2Selected > sp-button {
    @apply text-white w-[100px] rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none bg-gray-700 border border-gray-700;
  }
  .disabled > sp-button {
    @apply text-gray-500 bg-gray-100 border-gray-200;
  }
</style>
