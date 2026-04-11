'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

function usePlans() {
  const { t } = useI18n()
  const p = t.payment

  const PLANS = {
    starter: {
      name: p.starterName,
      price: 1,
      currency: '$',
      description: p.starterDesc,
      icon: '🚀',
      features: [
        p.features.listingOpt2,
        p.features.aiSeo,
        p.features.platformSupport,
        p.features.langSupport,
        p.features.keywords,
      ]
    },
    pro: {
      name: p.proName,
      price: 19,
      currency: '$',
      description: p.proDesc,
      icon: '⚡',
      features: [
        p.features.listingOpt100,
        p.features.aiSeo,
        p.features.platformSupport,
        p.features.langSupport,
        p.features.keywords,
        p.features.bulkGen,
        p.features.competitor,
        p.features.priority,
      ]
    },
    business: {
      name: p.businessName,
      price: 49,
      currency: '$',
      description: p.businessDesc,
      icon: '👑',
      features: [
        p.features.listingOptUnlimited,
        p.features.aiSeo,
        p.features.platformSupport,
        p.features.langSupport,
        p.features.keywords,
        p.features.bulkGen,
        p.features.competitor,
        p.features.brandDna,
        p.features.aiAssistant,
        p.features.vipSupport,
      ]
    },
  }

  const COMPARISON_FEATURES = [
    { name: p.comparison.monthlyListings, starter: '2', pro: '100', business: t.common.unlimited },
    { name: p.comparison.platformSupport, starter: '10+', pro: '10+', business: '10+' },
    { name: p.comparison.seoTitle, starter: '✓', pro: '✓', business: '✓' },
    { name: p.comparison.multiLang, starter: '✓', pro: '✓', business: '✓' },
    { name: p.comparison.keywords, starter: '✓', pro: '✓', business: '✓' },
    { name: p.comparison.bulkGen, starter: '✗', pro: '✓', business: '✓' },
    { name: p.comparison.competitor, starter: '✗', pro: '✓', business: '✓' },
    { name: p.comparison.abTest, starter: '✗', pro: '✓', business: '✓' },
    { name: p.comparison.brandDna, starter: '✗', pro: '✗', business: '✓' },
    { name: p.comparison.aiAssistant, starter: '✗', pro: '✗', business: '✓' },
    { name: p.comparison.vipSupport, starter: '✗', pro: '✗', business: '✓' },
  ]

  return { PLANS, COMPARISON_FEATURES, p }
}

function TrustBadge({ trust }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800">{trust.ssl}</p>
          <p className="text-xs text-gray-500 mt-0.5">{trust.sslDesc}</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800">{trust.secure}</p>
          <p className="text-xs text-gray-500 mt-0.5">{trust.secureDesc}</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800">{trust.days}</p>
          <p className="text-xs text-gray-500 mt-0.5">{trust.daysDesc}</p>
        </div>
      </div>
    </div>
  )
}

export default function OdemePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')
  const [showComparison, setShowComparison] = useState(false)
  const { PLANS, COMPARISON_FEATURES, p } = usePlans()

  useEffect(() => {
    loadUserData()
    // Check if user selected a plan from the landing page
    const savedPlan = localStorage.getItem('listingai_selected_plan')
    if (savedPlan && ['starter', 'pro', 'business'].includes(savedPlan)) {
      setSelectedPlan(savedPlan)
      localStorage.removeItem('listingai_selected_plan')
    }
  }, [])

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setCurrentPlan(profile.plan)
    }
  }

  async function handlePayment(planKey) {
    const plan = planKey || selectedPlan
    setSelectedPlan(plan)
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Session not found. Please sign in.')

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const res = await fetch('/api/lemonsqueezy/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan,
          userId: user.id,
          userEmail: user.email,
          userName: profile?.full_name || user.email.split('@')[0],
        }),
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Lemon Squeezy checkout sayfasına yönlendir
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      setError(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Active plan screen
  if (currentPlan !== 'free') {
    const activePlan = PLANS[currentPlan]
    return (
      <div className="pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 mb-5 shadow-lg">
              <span className="text-4xl">{activePlan?.icon || '🎉'}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activePlan?.name || currentPlan} — {p.active.planActive}
            </h1>
            <p className="text-base text-gray-500 max-w-md mx-auto">
              {p.active.activeDesc}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-brand-500 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{p.active.activePlan}</p>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {activePlan?.name || currentPlan}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">{currentPlan === 'starter' ? p.active.oneTimeLabel : p.active.monthlyLabel}</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    ${activePlan?.price || '0'}<span className="text-lg font-medium">{currentPlan !== 'starter' ? '/mo' : ''}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{p.active.featuresTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(activePlan?.features || []).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {currentPlan !== 'business' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.active.upgradeTitle}</h3>
              <p className="text-sm text-gray-500 mb-5">
                {p.active.upgradeDesc}
              </p>
              <button
                onClick={() => setCurrentPlan('free')}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all"
              >
                {p.active.viewPlans}
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center mt-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.active.supportTitle}</h3>
            <p className="text-sm text-gray-500 mb-5">
              {p.active.supportDesc}
            </p>
            <a href="mailto:listingai.official@gmail.com" className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all inline-block">
              {p.active.contactSupport}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Pricing screen
  return (
    <div className="pb-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-xs font-semibold text-brand-600 mb-4">
            <span>✨</span>
            <span>{p.startingFrom}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {p.pageTitle}
          </h1>
          <p className="text-base text-gray-500 max-w-lg mx-auto">
            {p.pageSubtitle}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {Object.entries(PLANS).map(([key, plan]) => {
            const isSelected = selectedPlan === key
            const isBusiness = key === 'business'
            const isStarter = key === 'starter'

            return (
              <div
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isBusiness ? 'md:-mt-2 md:mb-[-8px]' : ''
                }`}
              >
                <div className={`relative bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-brand-500 shadow-lg'
                    : 'ring-1 ring-gray-200 shadow-sm hover:shadow-md'
                } ${isBusiness ? 'ring-2 ring-brand-500' : ''}`}>

                  {/* Badge */}
                  {isBusiness && (
                    <div className="bg-gradient-to-r from-brand-500 to-purple-600 text-center py-2">
                      <span className="text-white text-xs font-bold uppercase tracking-wider">{p.mostPopular}</span>
                    </div>
                  )}

                  {/* Plan Content */}
                  <div className="p-6 flex flex-col h-full">
                    {/* Plan Name */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                        {isStarter && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                            {p.starterBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-5 border-b border-gray-100">
                      <div className="flex items-end gap-0.5">
                        <span className="text-lg font-bold text-gray-500 mb-1">$</span>
                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                        {!isStarter && (
                          <span className="text-sm text-gray-400 mb-1 ml-0.5">/mo</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {isStarter ? p.oneTime : p.allTaxes}
                      </p>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-2.5 flex-grow mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className={`w-4 h-4 ${isBusiness ? 'text-brand-500' : isStarter ? 'text-green-500' : 'text-brand-500'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePayment(key)
                      }}
                      disabled={loading && selectedPlan === key}
                      className={`w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                        isBusiness || isSelected
                          ? 'bg-gradient-to-r from-brand-500 to-purple-600 text-white hover:shadow-md active:scale-[0.98]'
                          : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
                      } ${(loading && selectedPlan === key) ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {loading && selectedPlan === key ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{p.redirecting}</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {isStarter ? p.tryNow : `$${plan.price}${p.perMonth} — ${p.getStarted}`}
                          </span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Note */}
                    <p className="text-center text-xs text-gray-400 mt-3">
                      {isStarter ? p.securePayment : p.moneyBack}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-lg mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">{p.error.title}</p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mb-12">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full text-center py-4 hover:bg-white/50 rounded-xl transition"
          >
            <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
              <svg className={`w-4 h-4 transition-transform ${showComparison ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {p.compareAll}
            </p>
          </button>

          {showComparison && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{p.comparison.feature}</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Starter</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pro</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-brand-600 uppercase tracking-wider bg-brand-50/50">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {COMPARISON_FEATURES.map((feature, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-700">{feature.name}</td>
                        {['starter', 'pro', 'business'].map((planKey) => (
                          <td key={planKey} className={`px-5 py-3 text-center text-sm ${
                            planKey === 'business' ? 'bg-brand-50/30' : ''
                          }`}>
                            {feature[planKey] === '✓' ? (
                              <svg className="w-4 h-4 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : feature[planKey] === '✗' ? (
                              <span className="text-gray-300">—</span>
                            ) : (
                              <span className="text-sm font-semibold text-gray-800">{feature[planKey]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="max-w-2xl mx-auto">
          <TrustBadge trust={p.trust} />
        </div>

        {/* Payment Methods */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">{p.accepted}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay'].map((method) => (
              <div key={method} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-500">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            {p.questions}{' '}
            <a href="mailto:listingai.official@gmail.com" className="text-brand-600 hover:text-brand-700 font-medium">
              listingai.official@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
