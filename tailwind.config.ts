import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accentSoft: 'rgb(var(--accent-soft) / <alpha-value>)',
        teal: 'rgb(var(--teal) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 18px 60px rgba(0,0,0,0.35)',
        highlight: '0 0 50px rgba(245, 158, 11, 0.25)',
      },
      backgroundImage: {
        noise:
          'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.08), transparent 28%), radial-gradient(circle at 30% 80%, rgba(45,212,191,0.08), transparent 30%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.35', transform: 'scaleX(0.9)' },
          '50%': { opacity: '1', transform: 'scaleX(1)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseLine: 'pulseLine 4s ease-in-out infinite',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--foreground) / 0.78)',
            '--tw-prose-headings': 'rgb(var(--foreground))',
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': 'rgb(var(--foreground))',
            '--tw-prose-counters': 'rgb(var(--foreground) / 0.55)',
            '--tw-prose-bullets': 'rgb(var(--foreground) / 0.3)',
            '--tw-prose-hr': 'rgb(var(--line) / 0.14)',
            '--tw-prose-quotes': 'rgb(var(--foreground) / 0.82)',
            '--tw-prose-quote-borders': 'rgb(var(--accent) / 0.55)',
            '--tw-prose-code': 'rgb(var(--accent))',
            '--tw-prose-pre-code': 'rgb(var(--foreground) / 0.9)',
            '--tw-prose-pre-bg': 'rgb(var(--line) / 0.05)',
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.zinc.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.amber.300'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.zinc.400'),
            '--tw-prose-bullets': theme('colors.zinc.700'),
            '--tw-prose-hr': theme('colors.zinc.800'),
            '--tw-prose-quotes': theme('colors.zinc.200'),
            '--tw-prose-quote-borders': theme('colors.amber.500'),
            '--tw-prose-code': theme('colors.amber.200'),
            '--tw-prose-pre-code': theme('colors.zinc.200'),
            '--tw-prose-pre-bg': 'rgba(10, 10, 15, 0.8)',
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config;
