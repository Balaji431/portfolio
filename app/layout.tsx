import type { Metadata, Viewport } from 'next';
import { instrumentSerif, dmSans, jetbrainsMono } from './fonts';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SkipToContent } from '@/components/SkipToContent';
import { SmoothScroll } from '@/components/SmoothScroll';
import { CustomCursor } from '@/components/CustomCursor';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://balajidasetti.space'),
  title: 'Balaji Dasetti, Full Stack Developer',
  description:
    'Junior Full Stack Developer based in Chennai, India. Flutter mobile applications, PHP 8.2 REST APIs, and MySQL backends.',
  alternates: {
    canonical: 'https://balajidasetti.space',
  },
  // TODO: Remove noindex and nofollow before public production launch
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Balaji Dasetti, Full Stack Developer',
    description:
      'Junior Full Stack Developer building Flutter applications, PHP 8.2 REST APIs, and MySQL databases.',
    url: 'https://balajidasetti.space',
    siteName: 'Balaji Dasetti Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Balaji Dasetti, Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balaji Dasetti, Full Stack Developer',
    description:
      'Junior Full Stack Developer based in Chennai, India. Flutter, PHP 8.2, MySQL.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio-theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored === 'dark' || (!stored && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (!prefersReduced) {
                    document.documentElement.classList.add('js-motion-ready');
                    window.__heroSafetyTimer = setTimeout(function() {
                      document.documentElement.classList.remove('js-motion-ready');
                    }, 2500);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <noscript>
          <style>{`
            .hero-line { transform: none !important; }
            .hero-intro { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
      </head>
      <body className="font-sans bg-bg text-ink min-h-screen flex flex-col selection:bg-accent selection:text-bg">
        <SmoothScroll />
        <CustomCursor />
        <SkipToContent />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
