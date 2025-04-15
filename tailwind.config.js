module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF9FA',
          100: '#D7F3F6',
          200: '#AFE7ED',
          300: '#87DBE3',
          400: '#5FCFDA',
          500: '#37C3D1',
          600: '#2C9CA7',
          700: '#21757D',
          800: '#174E54',
          900: '#0C272A',
        },
        secondary: {
          50: '#F3F0FF',
          100: '#E9E3FF',
          200: '#D4CAFF',
          300: '#BEB1FF',
          400: '#A797FF',
          500: '#917EFF',
          600: '#7465CC',
          700: '#574C99',
          800: '#3A3266',
          900: '#1D1933',
        },
        danger: {
          50: '#FFF0F0',
          100: '#FFDDDD',
          200: '#FFBBBB',
          300: '#FF9999',
          400: '#FF7777',
          500: '#FF5555',
          600: '#CC4444',
          700: '#993333',
          800: '#662222',
          900: '#331111',
        },
        warning: {
          50: '#FFFAEB',
          100: '#FFF6D6',
          200: '#FFEDAD',
          300: '#FFE485',
          400: '#FFDB5C',
          500: '#FFD333',
          600: '#CCA929',
          700: '#997F1F',
          800: '#665414',
          900: '#332A0A',
        },
        success: {
          50: '#EBFBF0',
          100: '#D7F8E1',
          200: '#AFF1C3',
          300: '#87EAA5',
          400: '#5FE487',
          500: '#37DD69',
          600: '#2CB154',
          700: '#21853F',
          800: '#16592A',
          900: '#0B2C15',
        },
        dark: {
          50: '#E6E8ED',
          100: '#CCD0DB',
          200: '#99A1B7',
          300: '#667293',
          400: '#33436F',
          500: '#00144B',
          600: '#00103C',
          700: '#000C2D',
          800: '#00081E',
          900: '#00040F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(95, 207, 218, 0.5)',
        'glow-light': '0 0 8px rgba(95, 207, 218, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}