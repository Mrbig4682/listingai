'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations, defaultLocale, locales, allPlatforms, getMarketFromLocale } from './translations'

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(defaultLocale)

  useEffect(() => {
    // Only use saved preference — no auto-detect from browser
    // Default is always English, users can switch manually from the language selector
    const saved = localStorage.getItem('listingai_locale')
    if (saved && locales.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale)
      localStorage.setItem('listingai_locale', newLocale)
    }
  }

  const t = translations[locale] || translations[defaultLocale]
  const market = getMarketFromLocale(locale)
  const platforms = allPlatforms

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, market, platforms, locales, translations }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback for SSR or outside provider
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: translations[defaultLocale],
      market: 'us',
      platforms: allPlatforms,
      locales,
      translations,
    }
  }
  return context
}
