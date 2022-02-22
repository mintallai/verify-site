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
  import { onMount } from 'svelte';
  import { isLoading, locale } from 'svelte-i18n';
  import { lang } from '@intl/adobe-locales';
  import Router from '@roxi/routify/runtime/Router.svelte';
  import { routes } from '../.routify/routes';
  import debug from 'debug';

  console.debug(`Verify site running revision ${process.env.GIT_REVISION}`);

  onMount(() => {
    const unsubscribe = locale.subscribe((loc) => {
      if (loc) {
        const language = lang(loc);
        debug('i18n')(`Setting html tag language to ${language}`);
        document.documentElement.setAttribute('lang', language);
      }
    });

    return unsubscribe;
  });
</script>

{#if !$isLoading}
  <Router {routes} />
{:else}
  <div />
{/if}

<style global>
  @import '../static/spectrum-vars.css';
  @import 'tailwindcss/base';
  @import '../static/base.css';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  @import 'tippy.js/dist/tippy.css';
</style>
