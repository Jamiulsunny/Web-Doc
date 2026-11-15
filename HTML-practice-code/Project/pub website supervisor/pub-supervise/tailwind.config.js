/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pub: {
          navy: '#073B4C',
          teal: '#07566A',
          cyan: '#27C2D1',
          cyanSurface: '#E5F8FB',
          bg: '#F5F8FC',
          card: '#FFFFFF',
          text: '#152D3A',
          muted: '#657786',
          border: '#E3EAF0',
          success: '#16865C',
          warning: '#D98B13',
          error: '#D94747'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
