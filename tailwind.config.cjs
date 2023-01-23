// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

const merge = require('lodash/merge');
const spectrumConfig = require('./tailwind.config.spectrum.cjs');

module.exports = merge(spectrumConfig, {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      sm: '10px',
      md: '10px',
      lg: '50px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1680px',
      lgHeight: { raw: '(min-height: 480px)' },
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
        0: '0',
      },
      gradientColorStops: {
        transparent: 'rgba(255, 255, 255, 0)',
        white: '#fff',
      },
      letterSpacing: {
        wide: '0.1px',
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
