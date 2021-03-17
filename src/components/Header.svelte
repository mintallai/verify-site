<script lang="ts">
  import Button from './Button.svelte';
  import {
    setSummary,
    learnMoreUrl,
    getFaqUrl,
    navigateToRoot,
  } from '../stores';

  function upload(evt) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }
</script>

<header class="flex">
  <div class="flex-shrink">
    <button on:click={() => navigateToRoot()} class="logo">
      <h1 class="font-black text-2xl leading-none">Verify</h1>
      <div class="beta">Beta</div>
    </button>
  </div>
  <div class="links">
    <a href="#" on:click={upload} class="font-bold text-sm tracking-tight"
      >Upload</a
    >
    <a
      href={getFaqUrl()}
      target="_blank"
      class="font-bold text-sm tracking-tight">FAQ</a
    >
  </div>
  <div class="ml-5">
    <Button href={$learnMoreUrl} outline={true}>Learn More</Button>
  </div>
</header>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center justify-between;
    max-width: 100vw;
    height: 80px;
  }
  .logo {
    @apply flex select-none outline-none;
  }
  .beta {
    @apply inline-block bg-gray-200 text-gray-700 font-semi-bold text-xxs rounded px-2 py-0 ml-3;
    line-height: 1.4375rem;
  }
  .links {
    @apply flex-grow text-right;
  }
  .links a {
    @apply ml-4;
  }
</style>
