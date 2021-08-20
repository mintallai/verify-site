import {
  register,
  init,
  locale,
  getLocaleFromQueryString,
  getLocaleFromNavigator,
} from 'svelte-i18n';
import { lang } from '@intl/adobe-locales';
import groupBy from 'lodash/groupBy';
import debug from 'debug';

const dbg = debug('i18n');

export const DEFAULT_LOCALE = 'en-US';
const LOCALSTORAGE_KEY = 'locale';
const GIT_REVISION = process.env.GIT_REVISION as string;

export const supportedLocales = process.env.SUPPORTED_LOCALES as string[];

export const supportedLanguages = groupBy(supportedLocales, lang);

function getSupportedLocale(locale: string) {
  const prefix = locale.split('-')[0];
  const matchingLocales = supportedLanguages[prefix] ?? [];
  if (matchingLocales.includes(locale)) {
    return locale;
  }
  if (matchingLocales.length) {
    return matchingLocales[0];
  }
  return DEFAULT_LOCALE;
}

export function initI18n() {
  supportedLocales.forEach((locale) => {
    register(locale, async () => {
      const url = `/locales/${locale}.json?rev=${GIT_REVISION}`;
      dbg(`Fetching locale information for ${locale} from ${url}`);
      const res = await fetch(url);
      const data = await res.json();
      dbg(`Received translations for ${locale}`, data);
      return data;
    });
  });

  const prevLocale = window.localStorage.getItem(LOCALSTORAGE_KEY);
  const requestedLocale =
    getLocaleFromQueryString('lang') || prevLocale || getLocaleFromNavigator();
  const initialLocale = getSupportedLocale(requestedLocale);

  if (initialLocale !== DEFAULT_LOCALE) {
    window.localStorage.setItem(LOCALSTORAGE_KEY, initialLocale);
  } else {
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  dbg('Detected language', initialLocale);

  init({
    fallbackLocale: DEFAULT_LOCALE,
    initialLocale,
  });
}

export function setLanguage(lang: string) {
  locale.set(lang);
  window.localStorage.setItem(LOCALSTORAGE_KEY, lang);
}
