import type { Metadata } from 'next';
import { Inter, Literata, Scheherazade_New } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ArticleProvider } from '@/context/article-context';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
});

const scheherazade = Scheherazade_New({
  subsets: ['arabic', 'latin'],
  variable: '--font-scheherazade',
  weight: ['400', '700'],
});


export const metadata: Metadata = {
  title: 'RisaletenNur Platformu',
  description: 'Bilgi, maneviyat ve aydınlanma üzerine yansımalar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${literata.variable} ${scheherazade.variable} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
