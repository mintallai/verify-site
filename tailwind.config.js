const merge = require('lodash/merge');
const spectrumConfig = require('./tailwind.config.spectrum');

module.exports = merge(spectrumConfig, {
  purge: [],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      boxShadow: {
        sm: '0 0 4px 0 rgba(0, 0, 0, 0.40)',
        md: '0 0 10px 0 rgba(0, 0, 0, 0.20)',
        lg: '0 0 40px 0 rgba(0, 0, 0, 0.10)',
        selected: 'inset 0 0 0 3px var(--blue-500)',
      },
      fontSize: {
        xxs: 'var(--font-size-50)',
        xs: 'var(--font-size-75)',
        sm: 'var(--font-size-100)',
        base: 'var(--font-size-100)',
        md: 'var(--font-size-200)',
        lg: 'var(--font-size-300)',
        xl: 'var(--font-size-400)',
        '5xl': 'var(--font-size-1000)',
      },
      opacity: {
        '0': '0',
      },
      gradientColorStops: {
        transparent: 'transparent',
        white: '#fff',
      },
    },
  },
  variants: {
    margin: ({ after }) => after(['first']),
    padding: ({ after }) => after(['first']),
    display: ['responsive'],
    backgroundColor: ['hover', 'responsive'],
    textColor: ['hover'],
    gradientColorStops: ['active'],
  },
});
