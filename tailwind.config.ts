```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      /* =====================================================
         FONTLAR
      ===================================================== */

      fontFamily: {
        body: [
          'var(--font-inter)',
          'sans-serif',
        ],

        headline: [
          'var(--font-literata)',
          'serif',
        ],

        reading: [
          'var(--font-literata)',
          'serif',
        ],

        arabic: [
          'var(--font-scheherazade)',
          'serif',
        ],

        osmanlica: [
          'var(--font-scheherazade)',
          'serif',
        ],

        rika: [
          'var(--font-aref-ruqaa)',
          'serif',
        ],

        code: ['monospace'],
      },

      /* =====================================================
         RENKLER
      ===================================================== */

      colors: {
        background:
          'hsl(var(--background))',

        foreground:
          'hsl(var(--foreground))',

        card: {
          DEFAULT:
            'hsl(var(--card))',
          foreground:
            'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT:
            'hsl(var(--popover))',
          foreground:
            'hsl(var(--popover-foreground))',
        },

        primary: {
          DEFAULT:
            'hsl(var(--primary))',
          foreground:
            'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT:
            'hsl(var(--secondary))',
          foreground:
            'hsl(var(--secondary-foreground))',
        },

        muted: {
          DEFAULT:
            'hsl(var(--muted))',
          foreground:
            'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT:
            'hsl(var(--accent))',
          foreground:
            'hsl(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT:
            'hsl(var(--destructive))',
          foreground:
            'hsl(var(--destructive-foreground))',
        },

        border:
          'hsl(var(--border))',

        input:
          'hsl(var(--input))',

        ring:
          'hsl(var(--ring))',
      },

      /* =====================================================
         KÖŞE YUVARLAKLIĞI
      ===================================================== */

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',

        card: '2.5rem',
        pill: '9999px',
      },

      /* =====================================================
         GÖLGELER
      ===================================================== */

      boxShadow: {
        deep:
          '0 20px 60px -20px rgba(15, 23, 42, 0.22), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',

        card:
          '0 15px 45px -15px rgba(15, 23, 42, 0.18)',

        'card-hover':
          '0 25px 70px -20px rgba(15, 23, 42, 0.28)',

        soft:
          '0 10px 30px -10px rgba(15, 23, 42, 0.12)',

        orange:
          '0 12px 30px -10px rgba(249, 115, 22, 0.35)',
      },

      /* =====================================================
         YAZI GÖLGESİ
      ===================================================== */

      textShadow: {
        heavy:
          '0 1px 2px rgba(15, 23, 42, 0.16)',

        soft:
          '0 1px 3px rgba(15, 23, 42, 0.10)',

        white:
          '0 1px 2px rgba(255, 255, 255, 0.8)',
      },

      /* =====================================================
         ANİMASYONLAR
      ===================================================== */

      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height:
              'var(--radix-accordion-content-height)',
          },
        },

        'accordion-up': {
          from: {
            height:
              'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },

        'card-enter': {
          from: {
            opacity: '0',
            transform:
              'translateY(12px) scale(0.98)',
          },
          to: {
            opacity: '1',
            transform:
              'translateY(0) scale(1)',
          },
        },

        'card-float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-4px)',
          },
        },
      },

      animation: {
        'accordion-down':
          'accordion-down 0.2s ease-out',

        'accordion-up':
          'accordion-up 0.2s ease-out',

        'card-enter':
          'card-enter 0.5s ease-out',

        'card-float':
          'card-float 4s ease-in-out infinite',
      },

      /* =====================================================
         TRANSITION
      ===================================================== */

      transitionTimingFunction: {
        'card-smooth':
          'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```
