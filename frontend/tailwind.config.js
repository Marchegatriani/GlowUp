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
          bg: '#FAFAFA',      // Gray 50
          brand: '#DB2777',   // Pink 600
          text: '#000000',    // Black
          muted: '#8E7D84',   // Kept for backward compatibility
          label: '#5E5F5B',   // Kept for backward compatibility
          input: '#FFFFFF',   // White
          dark: '#000000',    // Black
          pink: {
            50: '#FDF2F8',
            100: '#FCE7F3',
            400: '#F472B6',
            600: '#DB2777',
          },
          yellow: {
            50: '#FEFCE8',
            500: '#EAB308',
            600: '#CA8A04',
          },
          red: {
            50: '#FEF2F2',
            500: '#EF4444',
          },
          gray: {
            50: '#FAFAFA',
            200: '#E5E7EB',
          }
        },
      },
      backgroundImage: {
        'glow-gradient': 'linear-gradient(113deg, #FCE7F3 0%, #FEFCE8 100%)',
        'glow-gradient-hover': 'linear-gradient(113deg, #FDF2F8 0%, #EAB308 100%)',
        'glow-gradient-bold': 'linear-gradient(113deg, #F472B6 0%, #EAB308 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
