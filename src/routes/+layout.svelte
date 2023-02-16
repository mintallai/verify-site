<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { postEvent } from '$lib/analytics';
  import { SITE_VERSION } from '$lib/config';
  import Dialog from '../components/Dialog.svelte';
  import { dialog } from '../stores';
  import debug from 'debug';
  import { lang } from '@intl/adobe-locales';
  import { locale } from 'svelte-i18n';
  import { onMount } from 'svelte';

  import '../globalWebComponents';
  import '../app.css';

  afterNavigate(() => {
    let duration: number;
    if ('getEntriesByType' in window.performance) {
      const navPerf = window.performance?.getEntriesByType('navigation')?.[0];
      duration = navPerf?.duration;
    }
    postEvent({
      'event.type': 'render',
      'event.subtype': 'page',
      'event.value': duration,
    });
    return true;
  });

  onMount(() => {
    // @TODO: can't import serverside - look into this
    import('c2pa-wc');
    console.debug(`Verify site running revision ${SITE_VERSION}`);

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

<div class="theme-light min-w-[var(--screen-width)] overflow-auto max-h-screen">
  <slot />
</div>

<Dialog {...$dialog} />

<style>
</style>
