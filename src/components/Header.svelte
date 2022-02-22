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
  import { _ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';
  import Button from './Button.svelte';
  import {
    learnMoreUrl,
    getFaqUrl,
    navigateToRoot,
    isBurgerMenuShown,
    setProvenance,
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

  function chooseImage() {
    isBurgerMenuShown.update((shown) => !shown);
    setProvenance(null);
  }
</script>

<header class="flex relative">
  <div class="flex-shrink">
    <button
      on:click={goToLanding}
      class="flex select-none outline-none items-center">
      <h1
        data-test-id="header.app-name"
        class="font-black text-600 text-gray-900 leading-none">
        {$_('comp.header.productName')}
      </h1>
      <div class="beta">{$_('comp.header.beta')}</div>
    </button>
  </div>
  <div class="links full-menu">
    <button
      data-test-id="header.choose-image"
      on:click={upload}
      class="font-bold text-sm tracking-tight">
      {$_('comp.header.uploadImage')}
    </button>
    <a
      href={getFaqUrl()}
      target="_blank"
      class="font-bold text-sm tracking-tight">{$_('comp.header.faq')}</a>
  </div>
  <div class="ml-5 full-menu">
    <Button testId="header.learn-more" href={$learnMoreUrl} outline={true}
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
      <a
        data-test-id="header.choose-image-mobile"
        href="/inspect"
        on:click={chooseImage}>{$_('comp.header.uploadImage')}</a>
      <a href={getFaqUrl()} target="_blank">FAQ</a>
      <a data-test-id="header.learn-more-mobile" href={$learnMoreUrl}
        >{$_('comp.header.learnMore')}</a>
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
