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
  import { goto, params, url } from '@roxi/routify';
  import { _, locale } from 'svelte-i18n';
  import OverviewIcon from '../../assets/svg/monochrome/overview.svg';
  import InspectIcon from '../../assets/svg/monochrome/inspect.svg';
  import { style } from 'd3-selection';
  let textColor = 'blue';
  export let inInspect: boolean;
  export let inOverview: boolean;
</script>

<sp-theme color="lightest" scale="medium">
  <div class="inline-block">
    {#if inOverview}
      <div class="container1Selected inline-block">
        <sp-button on:click={$goto('/overview')}>
          <div class="flex">
            <OverviewIcon class="h-4 w-4 mr-2" />
            {$_('comp.topNavigation.overview')}
          </div>
        </sp-button>
      </div>
    {:else}
      <div class="container1 inline-block">
        <sp-button on:click={$goto('/overview')}>
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
    border-top-right-radius: 0%;
    border-bottom-right-radius: 0%;
    border-top-left-radius: 10%;
    border-bottom-left-radius: 10%;
    width: 100px;
    color: black;
    background-color: white;
    border: 2px solid #cacaca;
  }
  .container1Selected > sp-button {
    border-top-right-radius: 0%;
    border-bottom-right-radius: 0%;
    border-top-left-radius: 10%;
    border-bottom-left-radius: 10%;
    width: 100px;
    color: #1473e6;
    background-color: white;
    border: 2px solid #cacaca;
  }
  .container1 > sp-button:hover {
    color: #1473e6;
  }
  .container2 > sp-button:hover {
    color: #1473e6;
  }
  .container2 > sp-button {
    border-top-right-radius: 10%;
    border-bottom-right-radius: 10%;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
    width: 100px;
    color: black;
    background-color: white;
    border: 2px solid #cacaca;
  }
  .container2Selected > sp-button {
    border-top-right-radius: 10%;
    border-bottom-right-radius: 10%;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
    width: 100px;
    color: #1473e6;
    background-color: white;
    border: 2px solid #cacaca;
  }
</style>
