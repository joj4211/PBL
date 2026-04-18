/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFFDD0',
          50: '#FFFEF8',
          100: '#FFFEF0',
          200: '#FFFDE8',
        },
        sage: {
          50: '#F0F5EC',
          100: '#DCE8D5',
          200: '#B8D0A8',
          300: '#95B880',
          400: '#78A05E',
          500: '#5E8847',
          600: '#4A6D38',
          700: '#3A5529',
          800: '#2C4020',
          DEFAULT: '#87AE73',
        },
        warm: {
          50: '#FAF7F0',
          100: '#F5EFE0',
          200: '#EDE0C4',
          300: '#DFC99E',
          400: '#CEB07A',
          500: '#B89660',
          600: '#9A7A4A',
          700: '#7A5E38',
          800: '#5C4528',
          900: '#3D2E1A',
          DEFAULT: '#C4A882',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'Georgia', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
