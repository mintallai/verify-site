import type { Preview } from '@storybook/svelte';
import { withDesign } from 'storybook-addon-designs';
import { setContext } from 'svelte';
import { DEFAULT_LOCALE, supportedLocales } from '../src/lib/i18n';
import I18n from './decorators/I18n.svelte';
import Style from './decorators/Style.svelte';

const i18nDecorator = (_, context) => {
  const locale = context.globals?.locale ?? DEFAULT_LOCALE;
  setContext('locale', locale);

  return I18n;
};

const styleDecorator = () => Style;

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      canvas: { sourceState: 'none' },
    },
  },
  decorators: [i18nDecorator, styleDecorator, withDesign],
};

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'I18n locale',
    toolbar: {
      icon: 'globe',
      items: supportedLocales.map((locale) => {
        return { value: locale, title: locale };
      }),
      showName: true,
    },
  },
};

export default preview;
