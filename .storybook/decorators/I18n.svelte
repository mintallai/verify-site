<script lang="ts">
  import { DEFAULT_LOCALE, registerLocales } from '$lib/i18n';
  import { getAllContexts, onMount } from 'svelte';
  import { init, waitLocale } from 'svelte-i18n';

  const contexts = getAllContexts();
  let initialized = false;

  onMount(async () => {
    const locale = contexts.get('locale');
    registerLocales();

    init({
      fallbackLocale: DEFAULT_LOCALE,
      initialLocale: locale,
    });

    await waitLocale(locale);

    initialized = true;
  });
</script>

{#if initialized}
  <slot />
{/if}
