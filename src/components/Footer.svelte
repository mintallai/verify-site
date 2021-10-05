<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { getLocalizedURL } from '@intl/adobe-locales';
  import { DEFAULT_LOCALE, setLanguage } from '../lib/i18n';
  import type { TippyProps } from '../lib/tippy';
  import { tippy } from '../lib/tippy';
  import Icon from './Icon.svelte';

  const mapping = [
    ['en-US', 'English'],
    ['fr-FR', 'Français'],
    ['de-DE', 'Deutsch'],
    ['ja-JP', '日本語'],
  ];

  let languageMenu: HTMLElement;

  const tippyOpts: Partial<TippyProps> = {
    interactive: true,
    trigger: 'click',
  };

  $: currentLocale = $locale || DEFAULT_LOCALE;
  $: currentLocaleMapping = mapping.find(
    ([mapLang]) => mapLang === currentLocale,
  );
  $: currentLangString = currentLocaleMapping[1];

  function handleLanguageChange(evt: any) {
    setLanguage(evt.target.value);
  }
</script>

<footer>
  {#if false}
    <div bind:this={languageMenu}>
      <sp-menu value={currentLocale}>
        {#each mapping as [code, label]}
          <sp-menu-item
            value={code}
            selected={code === currentLocale}
            on:click={handleLanguageChange}>
            {label}
          </sp-menu-item>
        {/each}
      </sp-menu>
    </div>
  {/if}
  <sp-theme color="light" scale="medium" class="w-full">
    <div class="flex justify-center items-center text-75">
      <span>
        {$_('comp.footer.copyright', { values: { year: '__year__' } })}
      </span>
      <div class="flex items-center">
        <a
          href={getLocalizedURL('https://www.adobe.com/privacy.html', $locale)}
          target="_blank">{$_('comp.footer.privacy')}</a>
        <a
          href={getLocalizedURL(
            'https://www.adobe.com/legal/terms.html',
            $locale,
          )}
          target="_blank">{$_('comp.footer.termsOfUse')}</a>
        {#if false}
          <button
            use:tippy={{ content: languageMenu, ...tippyOpts }}
            slot="trigger"
            aria-haspopup="true"
            aria-controls="popover"
            role="button">
            <div class="inline-flex items-center space-x-0.5 -mr-0.5">
              <span class="underline">{currentLangString}</span>
              <Icon size="xs" name="ChevronUp" />
            </div>
          </button>
        {/if}
        <a href="https://contentauthenticity.org/contact" target="_blank">
          {$_('comp.footer.contactUs')}
        </a>
      </div>
    </div>
  </sp-theme>
</footer>

<style lang="postcss">
  footer {
    @apply flex justify-center items-center border-t-2 border-gray-200;
    grid-area: footer;
    max-width: 100vw;
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
