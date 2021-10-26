const production = !process.env.ROLLUP_WATCH;
const merge = require('lodash/merge');
const spectrumConfig = require('./tailwind.config.spectrum');

module.exports = merge(spectrumConfig, {
  mode: 'jit',
  purge: {
    enabled: production,
    content: ['./src/**/*.{svelte,js,ts}'],
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1000px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1680px',
      lgHeight: { 'raw': '(min-height: 480px)' },
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
        smd: 'var(--font-size-150)',
        md: 'var(--font-size-200)',
        lg: 'var(--font-size-300)',
        xl: 'var(--font-size-400)',
        '2xl': 'var(--font-size-500)',
        '3xl': 'var(--font-size-600)',
        '4xl': 'var(--font-size-700)',
        '5xl': 'var(--font-size-800)',
        '6xl': 'var(--font-size-900)',
        '7xl': 'var(--font-size-1000)',
        '8xl': 'var(--font-size-1300)',
      },
      fontFamily: {
        serif: 'var(--family-serif)',
        home: 'var(--family-home)',
      },
      opacity: {
        '0': '0',
      },
      gradientColorStops: {
        transparent: 'rgba(255, 255, 255, 0)',
        white: '#fff',
      },
    },
  },
  variants: {
    margin: ({ after }) => after(['first']),
    padding: ({ after }) => after(['first']),
    display: ['responsive'],
    backgroundColor: ['hover', 'responsive'],
    backgroundOpacity: ['active'],
    textColor: ['hover'],
    gradientColorStops: ['active'],
  },
});
