import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './util/lang';
import debug from 'debug';

const dbg = debug('i18n');

const GIT_REVISION = process.env.GIT_REVISION;

SUPPORTED_LOCALES.forEach((locale) => {
  register(locale, async () => {
    const url = `/i18n/${locale}.json?rev=${GIT_REVISION}`;
    dbg(`Fetching locale information for ${locale} from ${url}`);
    const res = await fetch(url);
    const data = await res.json();
    dbg(`Received translations for ${locale}`, data);
    return data;
  });
});

init({
  fallbackLocale: DEFAULT_LOCALE,
  initialLocale: getLocaleFromNavigator(),
});
