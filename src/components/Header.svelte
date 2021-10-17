<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';
  import Button from './Button.svelte';
  import {
    learnMoreUrl,
    getFaqUrl,
    navigateToRoot,
    isBurgerMenuShown,
  } from '../stores';
  import '@contentauth/web-components/dist/icons/color/logos/adobe';
  import 'vanilla-hamburger/fade-burger';

  function handleBurgerClick() {
    isBurgerMenuShown.update((shown) => !shown);
  }

  function upload(evt: Event) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }

  function goToLanding(evt: Event) {
    window.location.assign('/');
    evt.preventDefault();
  }
</script>

<header class="flex relative">
  <div class="flex-shrink">
    <button
      on:click={goToLanding}
      class="flex select-none outline-none items-center">
      <h1 class="font-black text-600 text-gray-900 leading-none">
        {$_('comp.header.productName')}
      </h1>
      <div class="beta">{$_('comp.header.beta')}</div>
    </button>
  </div>
  <div class="links full-menu">
    <button on:click={upload} class="font-bold text-sm tracking-tight">
      {$_('comp.header.uploadImage')}
    </button>
    <a
      href={getFaqUrl()}
      target="_blank"
      class="font-bold text-sm tracking-tight">{$_('comp.header.faq')}</a>
  </div>
  <div class="ml-5 full-menu">
    <Button href={$learnMoreUrl} outline={true}
      >{$_('comp.header.learnMore')}</Button>
  </div>
  <div class="block md:hidden -mr-3">
    <fade-burger
      on:pressed-changed={handleBurgerClick}
      size="24"
      duration="0.2"
      class="text-gray-600 close"
      pressed={$isBurgerMenuShown} />
  </div>
  {#if $isBurgerMenuShown}
    <div transition:slide={{ duration: 300 }} class="burger-menu">
      <a href={getFaqUrl()} target="_blank">FAQ</a>
      <a href={$learnMoreUrl}>{$_('comp.header.learnMore')}</a>
    </div>
  {/if}
</header>

<style lang="postcss">
  header {
    @apply border-gray-200 bg-white border-b-2 px-5 flex items-center justify-between z-40;
    grid-area: header;
    max-width: 100vw;
    height: 80px;
  }
  .full-menu {
    @apply hidden;
  }
  .beta {
    @apply inline-block bg-gray-200 text-gray-700 font-semi-bold text-xxs rounded px-2 py-0 ml-3;
    line-height: 1.4375rem;
  }
  .links {
    @apply flex-grow text-right;
  }
  .links a,
  .links button {
    @apply ml-4 text-gray-800;
  }
  .burger-menu {
    @apply flex flex-col absolute bg-white px-4;
    top: 80px;
    left: 0;
    right: 0;
  }
  .burger-menu a {
    @apply inline-block font-bold py-5 border-b border-gray-300;
  }
  .burger-menu a:last-of-type {
    @apply border-none;
  }
  @screen md {
    .full-menu {
      @apply block;
    }
  }
  @screen lgHeight {
    header {
      @apply sticky top-0;
    }
  }
</style>
