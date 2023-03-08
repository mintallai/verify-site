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
  import { handleUrl } from '$lib/util/handlers';
  import { _ } from 'svelte-i18n';
  import { forceProductionServices, getFaqUrl, learnMoreUrl } from '../stores';

  function upload(evt: Event) {
    window.location.assign('/inspect');
    window.newrelic?.addPageAction('uploadClick');
    evt.preventDefault();
  }

  function goToLanding(evt: Event) {
    window.location.assign('/');
    evt.preventDefault();
  }
</script>

<header class="flex relative min-w-[var(--screen-width)]">
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
      {#if $forceProductionServices}
        <div class="flag">Using production</div>
      {/if}
    </button>
  </div>
  <div class="links full-menu">
    <a
      data-test-id="header.choose-image"
      href="/inspect"
      on:click={upload}
      class="text-gray-300 font-medium text-sm tracking-tight">
      {$_('comp.header.uploadImage')}
    </a>
    <a
      href={getFaqUrl()}
      on:click={handleUrl(getFaqUrl(), 'faq')}
      target="_blank"
      rel="noreferrer"
      class="font-medium text-sm tracking-tight">{$_('comp.header.faq')}</a>
    <button
      data-test-id="header.learn-more"
      on:click={handleUrl($learnMoreUrl, 'learn')}
      class="font-medium text-sm tracking-tight"
      >{$_('comp.header.learnMore')}</button>
  </div>
</header>

<style lang="postcss">
  header {
    @apply border-gray-200 bg-white border-b-2 px-5 flex items-center justify-between z-10;
    grid-area: header;
    max-width: 100vw;
    height: 60px;
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
    @apply ml-4 text-gray-600;
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
  .flag {
    @apply inline-block bg-red-500 text-white font-semi-bold text-xxs rounded px-2 py-0 ml-3;
    line-height: 1.4375rem;
  }
</style>
