import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindNesting from 'tailwindcss/nesting/index.js';

const production = !process.env.ROLLUP_WATCH;

export default {
  plugins: [
    postcssImport,
    tailwindNesting,
    tailwindcss,
    autoprefixer,
    ...(production ? [cssnano({ preset: 'default' })] : []),
  ],
};
