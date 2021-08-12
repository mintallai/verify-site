<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { getLocalizedURL } from '@intl/adobe-locales';
</script>

<footer>
  <span class="copyright">
    {$_('comp.footer.copyright', { values: { year: '__year__' } })}
  </span>
  <span class="links">
    <a
      href={getLocalizedURL('https://www.adobe.com/privacy.html', $locale)}
      target="_blank">{$_('comp.footer.privacy')}</a>
    <a
      href={getLocalizedURL('https://www.adobe.com/legal/terms.html', $locale)}
      target="_blank">{$_('comp.footer.termsOfUse')}</a>
    <a href="https://contentauthenticity.org/contact" target="_blank">
      {$_('comp.footer.contactUs')}
    </a>
  </span>
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
