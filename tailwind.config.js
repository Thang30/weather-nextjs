/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom colors for light/dark themes
        primary: {
          light: '#60A5FA', // blue-400
          dark: '#3B82F6',  // blue-500
        },
        background: {
          light: '#F3F4F6', // gray-100
          dark: '#1F2937',  // gray-800
        },
        surface: {
          light: '#FFFFFF', // white
          dark: '#374151',  // gray-700
        },
        text: {
          light: '#1F2937', // gray-800
          dark: '#F9FAFB',  // gray-50
        }
      }
    },
  },
  plugins: [],
} 