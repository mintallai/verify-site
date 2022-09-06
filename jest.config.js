/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tests/tsconfig.json',
    },
  },
};
