import './globals.css'
import { I18nProvider } from '@/lib/i18n/context'

export const metadata = {
  title: 'ListingAI — AI-Powered E-Commerce Listing Optimizer',
  description: 'Optimize your e-commerce listings with AI. SEO-friendly titles, descriptions, and keywords for Amazon, eBay, Etsy, Trendyol, Mercado Libre and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface-50 text-trust-dark antialiased">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
