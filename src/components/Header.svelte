<script lang="ts">
  import Button from './Button.svelte';
  import { learnMoreUrl, faqUrl, navigateToRoot } from '../stores';

  export let allowDragDrop = false;
</script>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center justify-between;
    height: 80px;
  }
  header.allowDragDrop {
    @apply bg-purple-200;
  }
  .logo {
    @apply flex select-none outline-none;
  }
  .beta {
    @apply inline-block bg-gray-200 text-gray-700 font-semibold text-xxs rounded px-2 py-0 ml-3;
    line-height: 1.4375rem;
  }
  .dnd {
    @apply inline-block bg-purple-500 text-white font-semibold text-xxs rounded px-2 py-0 ml-3 uppercase;
    line-height: 1.4375rem;
  }
</style>

<header class="flex" class:allowDragDrop>
  <div class="flex-shrink">
    <button on:click={() => navigateToRoot()} class="logo">
      <h1 class="font-black text-2xl leading-none">Verify</h1>
      <div class="beta">Beta</div>
    </button>
  </div>
  {#if allowDragDrop}
    <div class="dnd">Drag and drop enabled</div>
  {/if}
  <div class="flex-grow text-right">
    <a href={$faqUrl} target="_blank" class="font-bold text-sm tracking-tight">
      FAQ
    </a>
  </div>
  <div class="ml-5">
    <Button href={$learnMoreUrl} outline={true}>Learn More</Button>
  </div>
</header>
