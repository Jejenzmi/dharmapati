import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2ff', 100: '#dbe3ff', 200: '#b8c6ff', 300: '#8ba1f5',
          400: '#5b74d6', 500: '#3a51b0', 600: '#26398a', 700: '#1a2a69',
          800: '#121f52', 900: '#0a1440', 950: '#050c28',
        },
        emas: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f5b301', 600: '#d99400', 700: '#b26a02',
          800: '#92530a', 900: '#78440c',
        },
      },
      fontFamily: {
        sans: ['var(--font-tubuh)', 'system-ui', 'sans-serif'],
        judul: ['var(--font-judul)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grid-halus':
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 .5H40M.5 0V40' stroke='%23ffffff' stroke-opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        naik: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        denyut: { '0%,100%': { opacity: '0.5', transform: 'scale(1)' }, '50%': { opacity: '0.15', transform: 'scale(1.6)' } },
        geserPelan: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        naik: 'naik .6s cubic-bezier(.22,1,.36,1) both',
        denyut: 'denyut 2.4s ease-in-out infinite',
        pita: 'geserPelan 40s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
