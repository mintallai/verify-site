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
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let title: string;
  export let content: string;
  export let stepNum: number;
  export let stepTotal: number;

  let element: HTMLElement;
  const dispatch = createEventDispatcher();

  function back() {
    dispatch('message', { action: 'back' });
  }

  function next() {
    dispatch('message', { action: 'next' });
  }

  function done() {
    dispatch('message', { action: 'done' });
  }

  export const getElement = () => element;
</script>

<div class="step" bind:this={element}>
  <h3>{$_(title)}</h3>
  <div class="content">{$_(content)}</div>
  <div class="footer">
    <div class="flex-grow">{stepNum} of {stepTotal}</div>
    {#if stepNum > 1}
      <button on:click={back} class="flex-shrink mr-4"
        >{$_('comp.tourStep.previous')}</button>
    {/if}
    {#if stepNum < stepTotal}
      <button on:click={next} class="flex-shrink"
        >{$_('comp.tourStep.next')}</button>
    {/if}
    {#if stepNum === stepTotal}
      <button on:click={done} class="flex-shrink"
        >{$_('comp.tourStep.done')}</button>
    {/if}
  </div>
</div>

<style lang="postcss">
  .step {
    @apply text-white text-base;
  }
  h3 {
    @apply font-bold mb-3;
  }
  .content {
    @apply leading-small;
  }
  .footer {
    @apply flex justify-between w-full mt-3;
  }
  .footer button {
    @apply font-bold;
  }
</style>
