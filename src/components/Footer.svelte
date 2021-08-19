<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { getLocalizedURL, lang } from '@intl/adobe-locales';

  const mapping = [
    ['en', 'English'],
    ['fr', 'Français'],
    ['de', 'Deutsch'],
    ['ja', '日本語'],
  ];

  $: currentLang = lang(mapping.find(([mapLang]) => mapLang === lang($locale)));

  function handleMenuChange(evt) {
    console.log('evt', evt);
  }
</script>

<footer>
  <span class="copyright">
    {$_('comp.footer.copyright', { values: { year: '__year__' } })}
  </span>
  <div class="inline-block">
    <a
      href={getLocalizedURL('https://www.adobe.com/privacy.html', $locale)}
      target="_blank">{$_('comp.footer.privacy')}</a>
    <a
      href={getLocalizedURL('https://www.adobe.com/legal/terms.html', $locale)}
      target="_blank">{$_('comp.footer.termsOfUse')}</a>
    <label for="language-picker">{currentLang}</label>
    <sp-theme color="light" scale="medium">
      <sp-picker id="language-picker" quiet size="m" label="Language">
        <span slot="label">{currentLang}</span>
        {#each mapping as [lang, label]}
          <sp-menu-item value={lang}>
            {label}
          </sp-menu-item>
        {/each}
      </sp-picker>
    </sp-theme>
    <a href="https://contentauthenticity.org/contact" target="_blank">
      {$_('comp.footer.contactUs')}
    </a>
  </div>
</footer>

<style lang="postcss">
  footer {
    @apply flex flex-col justify-center items-center text-75 border-t-2 border-gray-200;
    grid-area: footer;
    max-width: 100vw;
  }
  footer a {
    @apply underline;
  }
  footer a::before {
    @apply px-1;
    content: '|';
  }
  footer a:first-of-type::before {
    @apply hidden;
  }
  .copyright {
    @apply block;
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
