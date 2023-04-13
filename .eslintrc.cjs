const header = [
  ' ADOBE CONFIDENTIAL',
  { pattern: 'Copyright \\d{4} Adobe' },
  ' All Rights Reserved.',
  '',
  ' NOTICE: All information contained herein is, and remains',
  ' the property of Adobe and its suppliers, if any. The intellectual',
  ' and technical concepts contained herein are proprietary to Adobe',
  ' and its suppliers and are protected by all applicable intellectual',
  ' property laws, including trade secret and copyright laws.',
  ' Dissemination of this information or reproduction of this material',
  ' is strictly forbidden unless prior written permission is obtained',
  ' from Adobe.',
];

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['svelte3', '@typescript-eslint', 'header'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      // @TODO: Figure out header enforcement for svelte
      rules: { 'header/header': 'off' },
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    'header/header': ['error', 'line', header, 2],
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-non-null-assertion': ['error'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
