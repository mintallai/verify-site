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
          fontWeight: '800',
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
      white: 'var(--white)',
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
      'blue-600': 'var(--blue-600)',
    },

    extend: {
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.gray-50'),
      }),
    },
  },
  plugins: [],
} satisfies Config;
