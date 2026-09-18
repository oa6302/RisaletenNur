```tsx
import type { Metadata } from 'next';
import { Inter, Literata, Scheherazade_New } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { ArticleProvider } from '@/context/article-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

// --------------------------------------------------
// FONTLAR
// --------------------------------------------------

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
});

const scheherazade = Scheherazade_New({
  subsets: ['arabic', 'latin'],
  variable: '--font-scheherazade',
  weight: ['400', '700'],
  display: 'swap',
});

// --------------------------------------------------
// METADATA
// --------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: 'RisaletenNur Platformu',
    template: '%s | RisaletenNur Platformu',
  },

  description:
    'Risale-i Nur perspektifinden iman, hakikat, şuur ve manevi gelişim üzerine bilgi ve düşünce platformu.',

  keywords: [
    'Risale-i Nur',
    'iman',
    'hakikat',
    'maneviyat',
    'şuur',
    'ahlak',
    'gençlik',
    'manevi eğitim',
    'hakikat kartları',
  ],

  authors: [
    {
      name: 'RisaletenNur Platformu',
    },
  ],

  creator: 'RisaletenNur Platformu',

  applicationName: 'RisaletenNur Platformu',

  formatDetection: {
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: '/favicon.ico',
  },
};

// --------------------------------------------------
// ROOT LAYOUT
// --------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          ${literata.variable}
          ${scheherazade.variable}
          font-body
          antialiased
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <ArticleProvider>
              {children}
            </ArticleProvider>

            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```
