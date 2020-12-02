<script lang="ts">
  import { url } from '@roxi/routify';
  import Button from './Button.svelte';
  import { learnMoreUrl } from '../stores';
</script>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center justify-between;
    height: 80px;
  }
  .beta {
    @apply inline-block bg-gray-200 text-gray-700 font-semibold text-xxs rounded px-2 py-0 ml-3;
    line-height: 1.4375rem;
  }
</style>

<header class="flex">
  <div class="flex-shrink">
    <a href={$url('/')} class="flex flex-start select-none">
      <h1 class="font-black text-2xl leading-none">Verify</h1>
      <div class="beta">Beta</div>
    </a>
  </div>
  <div class="flex-grow text-right">
    <a href={$url('/faq')} class="font-bold text-sm tracking-tight"> FAQ </a>
  </div>
  <div class="ml-5">
    <Button href={$learnMoreUrl} outline={true}>Learn More</Button>
  </div>
</header>
