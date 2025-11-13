/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colores de marca Living Stone Contractors
        primary: {
          // Asparagus - Verde principal
          50: '#f4f7f1',
          100: '#e6ede0',
          200: '#cfdcc4',
          300: '#b0c79d',
          400: '#8faf75',
          500: '#6B8F4E', // Color principal de marca
          600: '#5a7841',
          700: '#475f34',
          800: '#3a4d2c',
          900: '#304026',
        },
        secondary: {
          // Eerie Black - Negro verdoso
          50: '#f6f6f5',
          100: '#e8e8e7',
          200: '#d1d2cf',
          300: '#b0b1ad',
          400: '#888a84',
          500: '#6b6d67',
          600: '#565853',
          700: '#484a45',
          800: '#3d3f3a',
          900: '#1F2117', // Color secundario de marca
        },
        accent: {
          // Coffee - Café/Marrón
          DEFAULT: '#694E3B',
          light: '#8b6f5c',
          dark: '#4d3829',
        },
        bone: '#E5DDD2', // Beige/Hueso
        cream: '#FCF9F3', // Baby Powder - Blanco crema
      },
      fontFamily: {
        // Usando Montserrat como alternativa a Gotham Pro (requiere licencia)
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
