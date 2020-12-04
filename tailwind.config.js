module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: [],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    fontFamily: {
      display: ['acumin-pro', 'sans-serif'],
      body: ['acumin-pro', 'sans-serif'],
    },
    extend: {
      colors: {
        blue: {
          '500': '#2680eb',
        },
        purple: {
          '200': 'rgba(85, 72, 237, 0.1)',
          '500': '#5548ed',
        },
        red: {
          '500': '#d7373f',
        },
        gray: {
          '100': '#fafafa',
          '150': '#f6f6f6',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '350': '#dddddd',
          '400': '#a8a8a8',
          '500': '#959595',
          '600': '#757575',
          '700': '#616161',
          '800': '#3D4246',
          '900': '#212121',
        },
      },
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '0.875rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        '5xl': ['3.125rem', { lineHeight: '1' }],
      },
      boxShadow: {
        sm: '0 0 4px 0 rgba(0, 0, 0, 0.40)',
        md: '0 0 10px 0 rgba(0, 0, 0, 0.20)',
        lg: '0 0 40px 0 rgba(0, 0, 0, 0.10)',
      },
    },
  },
  variants: {
    margin: ({ after }) => after(['first']),
    padding: ({ after }) => after(['first']),
  },
  plugins: [],
};
