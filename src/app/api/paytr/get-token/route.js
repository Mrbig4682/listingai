import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

const PLANS = {
  starter: { name: 'ListingAI Starter', price: 100, limit: 2, duration: 0 },     // 1.00 USD = 100 kuruş
  pro:     { name: 'ListingAI Pro', price: 1900, limit: 100, duration: 30 },      // 19.00 USD
  business:{ name: 'ListingAI Business', price: 4900, limit: 999999, duration: 30 }, // 49.00 USD
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail, userName } = await request.json()

    if (!plan || !PLANS[plan]) {
      return Response.json({ error: 'Geçersiz plan' }, { status: 400 })
    }
    if (!userId || !userEmail) {
      return Response.json({ error: 'Kullanıcı bilgisi eksik' }, { status: 400 })
    }

    const merchantId = process.env.PAYTR_MERCHANT_ID
    const merchantKey = process.env.PAYTR_MERCHANT_KEY
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT

    if (!merchantId || !merchantKey || !merchantSalt) {
      return Response.json({ error: 'Ödeme sistemi yapılandırma hatası' }, { status: 500 })
    }

    const selectedPlan = PLANS[plan]
    const merchantOid = `${userId.substring(0, 8)}_${plan}_${Date.now()}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'

    // IP adresi al
    const forwarded = request.headers.get('x-forwarded-for')
    const userIp = forwarded ? forwarded.split(',')[0].trim() : '85.34.78.112'

    // Kullanıcı sepeti — Base64 encode
    const userBasket = Buffer.from(
      JSON.stringify([[selectedPlan.name, selectedPlan.price.toString(), 1]])
    ).toString('base64')

    const paymentAmount = selectedPlan.price.toString()
    const noInstallment = '1'
    const maxInstallment = '0'
    const currency = 'USD'
    const testMode = process.env.PAYTR_TEST_MODE || '0'
    const merchantOkUrl = `${baseUrl}/dashboard/odeme/sonuc?status=success&message=${plan}`
    const merchantFailUrl = `${baseUrl}/dashboard/odeme/sonuc?status=failed&message=Ödeme başarısız`
    const timeout = '30'
    const debug = '1'
    const lang = 'tr'

    const buyerName = userName || userEmail.split('@')[0] || 'Musteri'

    // PayTR token oluştur — HMAC-SHA256
    const hashStr = [
      merchantId, userIp, merchantOid, userEmail,
      paymentAmount, userBasket, noInstallment,
      maxInstallment, currency, testMode, merchantSalt
    ].join('')

    const paytrToken = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64')

    // PayTR API'ye token isteği
    const formData = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: debug,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: buyerName,
      user_address: 'Digital Product',
      user_phone: '05000000000',
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      timeout_limit: timeout,
      currency: currency,
      test_mode: testMode,
      lang: lang,
    })

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    const result = await response.json()
    console.log('PayTR token response:', result.status, result.reason || '')

    if (result.status === 'success') {
      // Supabase'e ödeme kaydı
      const supabase = getSupabase()
      await supabase.from('shopier_payments').insert({
        user_id: userId,
        user_email: userEmail,
        plan: plan,
        amount: selectedPlan.price / 100,
        platform_order_id: merchantOid,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

      return Response.json({
        token: result.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      })
    } else {
      console.error('PayTR error:', result)
      return Response.json({
        error: result.reason || 'PayTR token alınamadı',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('PayTR get-token error:', error)
    return Response.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 })
  }
}
