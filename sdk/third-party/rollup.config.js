import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/cai-sdk.esm.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': `'production'`,
    }),
    copy({
      targets: [
        { src: 'static', dest: 'dist' },
        {
          src: 'node_modules/@contentauth/toolkit/pkg/web',
          dest: 'dist',
          rename: 'pkg',
        },
      ],
    }),
    production && terser(),
  ],
};
