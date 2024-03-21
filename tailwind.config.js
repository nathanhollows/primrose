/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: 'class',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  safelist: ['alert', 'alert-success', 'alert-error', 'alert-warning', 'alert-info'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'synthwave',
      'retro',
      'halloween',
      'forest',
      'pastel',
      'fantasy',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset'
    ]
  }
}
