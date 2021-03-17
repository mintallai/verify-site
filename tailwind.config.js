const merge = require('lodash/merge');
const spectrumConfig = require('./tailwind.config.spectrum');

module.exports = merge(spectrumConfig, {
  purge: [],
  theme: {
    extend: {
      boxShadow: {
        sm: '0 0 4px 0 rgba(0, 0, 0, 0.40)',
        md: '0 0 10px 0 rgba(0, 0, 0, 0.20)',
        lg: '0 0 40px 0 rgba(0, 0, 0, 0.10)',
      },
      fontSize: {
        xxs: 'var(--font-size-50)',
        xs: 'var(--font-size-75)',
        sm: 'var(--font-size-100)',
        base: 'var(--font-size-150)',
        xl: 'var(--font-size-400)',
        '5xl': 'var(--font-size-1000)',
      },
      opacity: {
        '0': '0',
      },
    },
  },
  variants: {
    margin: ({ after }) => after(['first']),
    padding: ({ after }) => after(['first']),
  },
});
