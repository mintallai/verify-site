<script lang="ts">
  import Button from './Button.svelte';
  import '@contentauth/web-components/dist/icons/color/logos/adobe';
  import { learnMoreUrl, getFaqUrl, navigateToRoot } from '../stores';

  function upload(evt: Event) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }
</script>

<header class="flex">
  <div class="flex-shrink">
    <button
      on:click={() => navigateToRoot()}
      class="flex select-none outline-none items-center"
    >
      <h1 class="font-black text-600 text-gray-900 leading-none">Verify</h1>
      <div class="beta">Beta</div>
    </button>
  </div>
  <div class="links">
    <a href="#" on:click={upload} class="font-bold text-sm tracking-tight"
      >Upload image</a
    >
    <a
      href={getFaqUrl()}
      target="_blank"
      class="font-bold text-sm tracking-tight">FAQ</a
    >
  </div>
  <div class="ml-5">
    <Button href={$learnMoreUrl} outline={true}>Learn more</Button>
  </div>
  <cai-icon-adobe class="ml-5" />
</header>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b-2 px-5 flex items-center justify-between;
    max-width: 100vw;
    height: 80px;
  }
  .beta {
    @apply inline-block bg-gray-200 text-gray-700 font-semi-bold text-xxs rounded px-2 py-0 ml-3;
    line-height: 1.4375rem;
  }
  .links {
    @apply flex-grow text-right;
  }
  .links a {
    @apply ml-4 text-gray-800;
  }
  cai-icon-adobe {
    --cai-icon-width: 24px;
    --cai-icon-height: 24px;
  }
</style>
