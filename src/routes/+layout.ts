// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import '$lib/i18n';
import { initI18n } from '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const ssr = false;

// Resolves an issue with Vercel and SvelteKit where the first request to a page fails with a 404
// See: https://stackoverflow.com/a/78189721
export const prerender = true;
export const trailingSlash = 'always'; // Added this

export const load: LayoutLoad = async () => {
  if (typeof window !== 'undefined') {
    initI18n();
    locale.set(window.navigator.language);
    await waitLocale();
  }
};
