/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#eef4ff',
            100: '#d9e6ff',
            200: '#b3ccff',
            300: '#80abff',
            400: '#4d84ff',
            500: '#265ff0',
            600: '#1a46c4',
            700: '#153a9e',
            800: '#122f7d',
            900: '#0f2564',
          },
          saffron: {
            50: '#fff7ed',
            100: '#ffedd3',
            200: '#ffd6a3',
            300: '#ffb85e',
            400: '#ff9a2e',
            500: '#f7801a',
            600: '#d9660f',
            700: '#b3500f',
            800: '#8f3f12',
            900: '#743512',
          },
          green: {
            50: '#eefdf3',
            100: '#d5f9e1',
            200: '#aef1c6',
            300: '#75e3a3',
            400: '#3fcd7d',
            500: '#1eb161',
            600: '#158f4e',
            700: '#137140',
            800: '#125a35',
            900: '#0f4a2d',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
