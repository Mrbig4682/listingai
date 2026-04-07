import './globals.css'
import { I18nProvider } from '@/lib/i18n/context'
import PWAInstallBanner from '@/components/PWAInstallBanner'

const baseUrl = 'https://www.listingai.store'

export const metadata = {
  title: 'ListingAI — AI-Powered E-Commerce Listing Optimizer',
  description: 'Optimize your e-commerce listings with AI. SEO-friendly titles, descriptions, and keywords for Amazon, eBay, Etsy, Trendyol, Mercado Libre and more.',
  keywords: 'e-commerce, listing optimizer, AI, SEO, Amazon, eBay, Etsy, Trendyol, Mercado Libre, product listings, SEO optimization',
  manifest: '/manifest.json',
  themeColor: '#7c3aed',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ListingAI',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  canonical: baseUrl,
  openGraph: {
    title: 'ListingAI — AI-Powered E-Commerce Listing Optimizer',
    description: 'Optimize your e-commerce listings with AI. SEO-friendly titles, descriptions, and keywords for Amazon, eBay, Etsy, Trendyol, Mercado Libre and more.',
    url: baseUrl,
    type: 'website',
    siteName: 'ListingAI',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ListingAI - AI-Powered E-Commerce Listing Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ListingAI — AI-Powered E-Commerce Listing Optimizer',
    description: 'Optimize your e-commerce listings with AI. SEO-friendly titles, descriptions, and keywords for Amazon, eBay, Etsy, Trendyol, Mercado Libre and more.',
    image: `${baseUrl}/og-image.png`,
  },
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(reg) {
                console.log('SW registered:', reg.scope);
              }).catch(function(err) {
                console.log('SW registration failed:', err);
              });
            });
          }
        `,
      }}
    />
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <ServiceWorkerRegistration />
      </head>
      <body className="bg-surface-50 text-trust-dark antialiased">
        <I18nProvider>
          {children}
          <PWAInstallBanner />
        </I18nProvider>
      </body>
    </html>
  )
}
