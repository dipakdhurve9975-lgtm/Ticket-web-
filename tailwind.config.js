/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          orange: '#FF5C00',
          'orange-hover': '#E05000',
          'orange-light': '#FFF0E8',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F4EB',
          200: '#EFE9DA',
          300: '#E5DCB8',
          400: '#D5C799',
        },
        charcoal: {
          800: '#232328',
          850: '#1D1D22',
          900: '#151518',
          950: '#0E0E10',
        },
        surface: {
          0: '#ffffff',
          50: '#FBF9F5',
          100: '#F3EFE6',
          200: '#E8E2D4',
          300: '#D5CDC0',
          400: '#9E9484',
          500: '#6E6555',
          600: '#524B3E',
          700: '#3D372D',
          800: '#25211B',
          900: '#151518',
        },
        priority: {
          critical: '#DC2626',
          'critical-bg': '#FEF2F2',
          high: '#EA580C',
          'high-bg': '#FFF7ED',
          medium: '#D97706',
          'medium-bg': '#FFFBEB',
          low: '#16A34A',
          'low-bg': '#F0FDF4',
        },
        status: {
          open: '#2563EB',
          'open-bg': '#EFF6FF',
          'in-progress': '#EA580C',
          'in-progress-bg': '#FFF7ED',
          waiting: '#D97706',
          'waiting-bg': '#FFFBEB',
          resolved: '#16A34A',
          'resolved-bg': '#F0FDF4',
          closed: '#52525B',
          'closed-bg': '#F4F4F5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(27, 24, 20, 0.06), 0 1px 3px 0 rgba(27, 24, 20, 0.04)',
        'soft-hover': '0 12px 28px -4px rgba(27, 24, 20, 0.1), 0 4px 10px -2px rgba(27, 24, 20, 0.06)',
        'orange-glow': '0 8px 24px -4px rgba(255, 92, 0, 0.35)',
      }
    },
  },
  plugins: [],
};
