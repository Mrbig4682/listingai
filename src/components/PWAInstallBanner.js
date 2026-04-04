'use client'
import { useState, useEffect } from 'react'

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    setIsStandalone(standalone)
    if (standalone) return

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-banner-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince < 7) return
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      // Show iOS banner after 3 seconds
      setTimeout(() => setShowBanner(true), 3000)
    }

    // Listen for beforeinstallprompt (Android/Chrome)
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowBanner(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-banner-dismissed', new Date().toISOString())
  }

  if (!showBanner || isStandalone) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">🚀</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm">ListingAI Uygulaması</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {isIOS
                ? 'Ana ekrana ekleyerek uygulama gibi kullan!'
                : 'Uygulamayı yükle, daha hızlı eriş!'}
            </p>
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {isIOS ? (
          <div className="mt-3 bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
                  </svg>
                </span>
                <span>Safari'de</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <span>Paylaş</span>
              </div>
              <span className="text-gray-400">→</span>
              <span className="font-semibold text-gray-700">Ana Ekrana Ekle</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="mt-3 w-full py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-lg transition"
          >
            Uygulamayı Yükle
          </button>
        )}
      </div>
    </div>
  )
}
