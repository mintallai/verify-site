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
