<script lang="ts">
  import { createEventDispatcher } from 'svelte';

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

<style lang="postcss">
  .step {
    @apply text-white text-base;
  }
  h3 {
    @apply font-bold mb-3;
  }
  .content {
    @apply leading-snug;
  }
  .footer {
    @apply flex justify-between w-full mt-3;
  }
  .footer button {
    @apply font-bold;
  }
</style>

<div class="step" bind:this={element}>
  <h3>{title}</h3>
  <div class="content">{content}</div>
  <div class="footer">
    <div class="flex-grow">{stepNum} of {stepTotal}</div>
    {#if stepNum > 1}
      <button on:click={back} class="flex-shrink mr-4">Previous</button>
    {/if}
    {#if stepNum < stepTotal}
      <button on:click={next} class="flex-shrink">Next</button>
    {/if}
    {#if stepNum === stepTotal}
      <button on:click={done} class="flex-shrink">Done</button>
    {/if}
  </div>
</div>
