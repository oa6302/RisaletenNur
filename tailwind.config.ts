```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/utils.ts',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        navy: {
          50: '#f2f6fb',
          100: '#e5edf7',
          200: '#cbd9eb',
          300: '#9eb6d3',
          400: '#6c91b9',
          500: '#426e9d',
          600: '#2f5783',
          700: '#27466c',
          800: '#233d5a',
          900: '#20344c',
          950: '#0d1b2a',
        },

        orange: {
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
        },
      },

      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],

        display: [
          'var(--font-literata)',
          'Literata',
          'Georgia',
          'serif',
        ],

        arabic: [
          'var(--font-scheherazade)',
          'Scheherazade New',
          'Amiri',
          'serif',
        ],
      },

      borderRadius: {
        xs: '0.5rem',
        sm: '0.625rem',
        md: '0.875rem',
        lg: '1.125rem',
        xl: '1.375rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
        '4xl': '2.75rem',
      },

      boxShadow: {
        soft: '0 4px 24px rgba(15, 23, 42, 0.06)',
        card: '0 8px 30px rgba(15, 23, 42, 0.08)',
        elevated: '0 18px 50px rgba(15, 23, 42, 0.12)',
        premium: '0 25px 70px rgba(15, 23, 42, 0.15)',
        orange: '0 12px 35px rgba(249, 115, 22, 0.20)',
        'orange-lg': '0 20px 55px rgba(249, 115, 22, 0.25)',
        inner: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },

      backgroundImage: {
        'premium-gradient':
          'linear-gradient(135deg, #0d1b2a 0%, #172a46 55%, #203b5d 100%)',

        'orange-gradient':
          'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',

        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(249,115,22,0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(59,130,246,0.16), transparent 30%), linear-gradient(135deg, #0d1b2a, #162b46)',

        'grid-pattern':
          'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
      },

      backgroundSize: {
        grid: '32px 32px',
      },

      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
      },

      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },

        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-14px)',
          },
        },

        'pulse-soft': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.65',
          },
        },

        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },

        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.96)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
    },
  },

  plugins: [],
};

export default config;
```
