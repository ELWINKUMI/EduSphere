/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 15s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(0px) translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateX(30px) translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateX(-20px) translateY(20px) rotate(240deg)' },
          '100%': { transform: 'translateX(0px) translateY(0px) rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: '0.1' },
        },
      },
    },
  },
  plugins: [],
}
