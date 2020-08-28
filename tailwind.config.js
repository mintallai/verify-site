module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [],
  theme: {
    fontFamily: {
      display: ['acumin-pro', 'sans-serif'],
      body: ['acumin-pro', 'sans-serif'],
    },
    extend: {
      colors: {
        purple: '#5548ed',
        gray: {
          '100': '#fafafa',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#a8a8a8',
          '500': '#959595',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        },
      },
      fontSize: {
        base: '0.9375rem',
      },
      boxShadow: {
        md: '0 0 10px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  variants: {},
  plugins: [],
};
