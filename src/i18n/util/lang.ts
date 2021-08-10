import debug from 'debug';

const dbg = debug('i18n');

// Default language as fallback
export const DEFAULT_LOCALE = 'en-US';

/**
 * Enum with the default language tag with country per language provided. This serves as a fallback when a specific
 * country is not available.
 *
 * @enum {Object}
 */
export const SUPPORTED_LOCALES = process.env.SUPPORTED_LOCALES;

dbg('Supported locales', SUPPORTED_LOCALES);

function isSupportedLanguage(language) {
  if (language.startsWith('zh')) {
    return true;
  }
  const languageWithoutRegion = language.split(/[-]+/)[0].toLowerCase();
  return Object.keys(SUPPORTED_LOCALES).includes(languageWithoutRegion);
}

// UI Language negotiation
export function detectLanguage() {
  // Set default UI language to be English
  if (typeof window === 'undefined') {
    return null;
  }

  // Allow user / tester to override browser language with 'lang' param in URL
  // Example: https://localhost:3000/?lang=ja-JP
  if (typeof URL !== 'undefined') {
    const url = new URL(document.location.href);
    const langUrl = (url.searchParams.get('lang') || '').replace('_', '-');
    if (langUrl && isSupportedLanguage(langUrl)) {
      return langUrl;
    }
  }

  // You can insert code for detecting cookie language here

  // Last step, we return the most preferred *supported* language from the browser's list or the default
  const found = (navigator.languages || []).find(isSupportedLanguage);
  return found || null;
}
