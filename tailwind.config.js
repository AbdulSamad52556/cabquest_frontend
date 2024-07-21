
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#D9D9D9',
          DEFAULT: '#031919', // this will be the default shade
          dark: '#023E8A',
        },
        secondary: {
          light: '#E7B914',
          DEFAULT: '#020E1A',
          dark: '#FF006E',
        },
        territory:{
          light:'#000',
          DEFAULT:'#7F8C8D',
          dark:'#000'
        },
        trial:{
          light:'#0077B6',
          DEFAULT: '#2A0348',
          dark:'#fff'
        },
      },
      height: {
        '50vh':'50vh',
        '150vh': '150vh',
        '200vh': '200vh',
      },
      fontFamily: {
        'pt-sans': ['PT Sans', 'sans-serif'], 
        'caviet': ['Caviet', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [
    require('daisyui'),
  ]
} 