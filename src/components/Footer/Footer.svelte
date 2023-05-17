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
  import { DEFAULT_LOCALE, setLanguage } from '$lib/i18n';
  import type { ReferenceElement, TippyProps } from '$lib/tippy';
  import { tippy } from '$lib/tippy';
  import { getLocalizedURL } from '@intl/adobe-locales';
  import type { MenuItem } from '@spectrum-web-components/menu';
  import { _, locale } from 'svelte-i18n';

  import '@spectrum-web-components/menu/sp-menu-item.js';
  import '@spectrum-web-components/menu/sp-menu.js';

  const mapping = [
    ['en-US', 'English'],
    ['fr-FR', 'Français'],
    ['de-DE', 'Deutsch'],
    ['ja-JP', '日本語'],
  ];

  let languageTrigger: HTMLButtonElement & ReferenceElement;
  let languageMenu: HTMLElement;

  const tippyOpts: Partial<TippyProps> = {
    interactive: true,
    trigger: 'click',
    appendTo: document.body,
    onShown() {
      languageMenu.querySelectorAll('sp-menu-item')?.[0]?.focus();
    },
  };

  $: currentLocale = $locale || DEFAULT_LOCALE;
  $: currentLocaleMapping = mapping.find(
    ([mapLang]) => mapLang === currentLocale,
  );
  $: currentLangString = currentLocaleMapping?.[1];

  function handleLanguageChange(evt: Event) {
    setLanguage((evt.target as MenuItem).value);
    languageTrigger._tippy?.hide();
  }
</script>

<footer class="bg-white">
  <div bind:this={languageMenu}>
    <sp-theme color="lightest" scale="medium" class="w-full">
      <sp-menu
        data-test-id="footer.language-menu"
        value={currentLocale}
        onchange={handleLanguageChange}>
        {#each mapping as [code, label]}
          <sp-menu-item
            data-test-id={`footer.language-option-${code}`}
            value={code}
            selected={code === currentLocale}>
            {label}
          </sp-menu-item>
        {/each}
      </sp-menu>
    </sp-theme>
  </div>
  <sp-theme color="lightest" scale="medium" class="w-full">
    <div class="text-75 flex items-center justify-center">
      <span>
        {$_('footer.copyright', {
          values: { year: new Date().getFullYear() },
        })}
      </span>
      <div class="flex items-center">
        <a
          href={getLocalizedURL('https://www.adobe.com/privacy.html', $locale)}
          target="_blank"
          rel="noreferrer">{$_('footer.privacy')}</a>
        <a
          href={getLocalizedURL(
            'https://www.adobe.com/legal/terms.html',
            $locale,
          )}
          target="_blank"
          rel="noreferrer">{$_('footer.termsOfUse')}</a>
        <a
          href="https://www.adobe.com/privacy/us-rights.html"
          target="_blank"
          rel="noreferrer">
          {$_('footer.rights')}
        </a>
        {#if languageMenu}
          <button
            bind:this={languageTrigger}
            use:tippy={{ content: languageMenu, ...tippyOpts }}
            data-test-id="footer.language-picker"
            slot="trigger"
            aria-haspopup="true"
            aria-controls="popover">
            <div class="-mr-0.5 inline-flex items-center space-x-0.5">
              <span class="underline">{currentLangString}</span>
            </div>
          </button>
        {/if}
      </div>
    </div>
  </sp-theme>
</footer>

<style lang="postcss">
  footer {
    @apply flex items-center justify-center border-t-2;
    grid-area: footer;
    max-width: 100vw;
    height: 3.5rem;
  }
  footer a {
    @apply underline;
  }
  footer a::before,
  footer button::before {
    @apply px-1;
    content: '|';
  }
  footer a:first-of-type::before {
    @apply hidden;
  }
  @screen md {
    footer {
      @apply flex-row;
    }
    footer span {
      @apply inline;
    }
    footer a:first-of-type::before {
      @apply inline;
    }
  }
</style>
