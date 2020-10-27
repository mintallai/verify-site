<script lang="ts">
  import { url } from '@sveltech/routify';
  import Button from './Button.svelte';
  import { learnMoreUrl } from '../stores';
</script>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center justify-between;
    height: 80px;
  }
  .logo {
    width: 28px;
    height: 28px;
  }
</style>

<header class="flex">
  <div class="flex-shrink">
    <a href={$url('/')} class="flex flex-start select-none">
      <img
        src="images/svg/logos/cai.svg"
        class="logo"
        alt="Content Authenticity Initiative" />
      <h1 class="font-black text-2xl leading-none ml-3">Verify</h1>
    </a>
  </div>
  <div class="flex-grow text-right">
    <a href={$url('/faq')} class="font-bold text-sm tracking-tight"> FAQ </a>
  </div>
  <div class="ml-5">
    <Button href={$learnMoreUrl}>Learn More</Button>
  </div>
</header>
