const production = !process.env.ROLLUP_WATCH;
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano')({ preset: 'default' });

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-nested'),
    autoprefixer,
    ...(production ? [cssnano] : []),
  ],
};
