import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#080810',
        deep: '#0d0d1a',
        card: '#11111f',
        purple: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          glow: '#7c3aed33',
          dark: '#6d28d9',
        },
        white: '#f0eeff',
        muted: '#7b7a9e',
        border: '#1e1e35',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-glow': 'pulseGlow 7s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease both',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}

export default config
