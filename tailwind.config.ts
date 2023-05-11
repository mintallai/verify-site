// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      serif: 'var(--family-serif)',
      home: 'var(--family-home)',
      base: 'var(--family-base)',
    },
    fontSize: {
      'large-title': [
        '1.5rem',
        {
          lineHeight: '1.875rem',
          fontWeight: '900',
        },
      ],
      title: [
        '1.125rem',
        {
          lineHeight: '1.5rem',
          fontWeight: '800',
        },
      ],
      header: [
        '0.9375rem',
        {
          lineHeight: '1.25rem',
          fontWeight: '700',
        },
      ],
      body: [
        '0.9375rem',
        {
          lineHeight: '1.25rem',
          fontWeight: '400',
        },
      ],
      description: [
        '0.9375rem',
        {
          lineHeight: '1.25rem',
          fontWeight: '400',
        },
      ],
      'small-description': [
        '0.8125rem',
        {
          lineHeight: '1rem',
          fontWeight: '400',
        },
      ],
      label: [
        '0.75rem',
        {
          lineHeight: '0.875rem',
          fontWeight: '700',
        },
      ],
    },
    colors: {
      white: 'var(--gray-50)',
      'gray-50': 'var(--gray-50)',
      'gray-75': 'var(--gray-75)',
      'gray-100': 'var(--gray-100)',
      'gray-200': 'var(--gray-200)',
      'gray-300': 'var(--gray-300)',
      'gray-400': 'var(--gray-400)',
      'gray-500': 'var(--gray-500)',
      'gray-600': 'var(--gray-600)',
      'gray-700': 'var(--gray-700)',
      'gray-800': 'var(--gray-800)',
      'gray-900': 'var(--gray-900)',
      'blue-100': 'var(--blue-100)',
      'blue-200': 'var(--blue-200)',
      'blue-300': 'var(--blue-300)',
      'blue-400': 'var(--blue-400)',
      'blue-500': 'var(--blue-500)',
      'blue-600': 'var(--blue-600)',
      'blue-700': 'var(--blue-700)',
      'blue-800': 'var(--blue-900)',
      'blue-900': 'var(--blue-900)',
      'blue-1000': 'var(--blue-1000)',
      'blue-1100': 'var(--blue-1100)',
      'blue-1200': 'var(--blue-1200)',
      'blue-1300': 'var(--blue-1300)',
    },

    extend: {
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.gray-200'),
      }),
    },
  },
  plugins: [],
} satisfies Config;
