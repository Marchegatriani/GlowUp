/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glowup: {
          bg: '#FAFAFA',
          brand: '#D27D9A',
          text: '#2E1221',
          muted: '#8E7D84',
          label: '#5E5F5B',
          input: '#FFFFFF',
          dark: '#2E1221',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
