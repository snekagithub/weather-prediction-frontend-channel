/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#60a5fa', 
          dark: '#1e3a8a',
        },
        surface: {
          light: '#f9fafb',
          dark: '#0f172a',
        },
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,0.08)',
        'glow': '0 0 25px rgba(59,130,246,0.25)',
      },
    },
  },
  plugins: [],
};
