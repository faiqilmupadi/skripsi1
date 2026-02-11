import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(37, 99, 235, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
