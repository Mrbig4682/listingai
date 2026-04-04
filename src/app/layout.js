import './globals.css'
import { I18nProvider } from '@/lib/i18n/context'

export const metadata = {
  title: 'ListingAI — AI-Powered E-Commerce Listing Optimizer',
  description: 'Optimize your e-commerce listings with AI. SEO-friendly titles, descriptions, and keywords for Amazon, eBay, Etsy, Trendyol, Mercado Libre and more.',
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-surface-50 text-trust-dark antialiased">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
