/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Mysa brand colors
        primary: {
          light: '#4DA8FF',
          DEFAULT: '#0078FF',
          dark: '#0057B8',
        },
        secondary: {
          light: '#FFB74D',
          DEFAULT: '#FF9800',
          dark: '#F57C00',
        },
        success: '#4CAF50',
        warning: '#FFC107',
        danger: '#F44336',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        dropdown: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
    },
  },
  plugins: [],
}
