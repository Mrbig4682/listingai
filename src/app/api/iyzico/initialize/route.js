import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

let Iyzipay = null
function getIyzipay() {
  if (!Iyzipay) {
    Iyzipay = require('iyzipay')
  }
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
  })
}

const PLANS = {
  pro: { name: 'Pro Plan', price: '299.00' },
  business: { name: 'Business Plan', price: '799.00' },
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail } = await request.json()

    if (!plan || !PLANS[plan]) {
      return Response.json({ error: 'Geçersiz plan' }, { status: 400 })
    }

    if (!userId || !userEmail) {
      return Response.json({ error: 'Kullanıcı bilgisi eksik' }, { status: 400 })
    }

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return Response.json({ error: 'Ödeme sistemi yapılandırma hatası' }, { status: 500 })
    }

    const selectedPlan = PLANS[plan]
    const basketId = `LISTINGAI_${plan.toUpperCase()}_${Date.now()}`
    const conversationId = `${userId.substring(0, 8)}_${Date.now()}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://listingai-gamma.vercel.app'

    // Supabase'e ödeme kaydı oluştur
    const supabase = getSupabase()
    await supabase.from('payment_requests').insert({
      user_id: userId,
      plan: plan,
      amount: parseFloat(selectedPlan.price),
      sender_name: userEmail,
      transfer_note: `iyzico - ${basketId}`,
      status: 'pending',
    })

    // iyzipay ile ödeme formu oluştur
    const iyzipay = getIyzipay()

    const paymentRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: selectedPlan.price,
      paidPrice: selectedPlan.price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: basketId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${baseUrl}/api/iyzico/callback`,
      enabledInstallments: [1, 2, 3, 6],
      buyer: {
        id: userId,
        name: userEmail.split('@')[0],
        surname: 'User',
        gsmNumber: '+905350000000',
        email: userEmail,
        identityNumber: '11111111111',
        registrationAddress: 'Istanbul Turkey',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: userEmail.split('@')[0] + ' User',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul Turkey',
      },
      billingAddress: {
        contactName: userEmail.split('@')[0] + ' User',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul Turkey',
      },
      basketItems: [
        {
          id: plan,
          name: selectedPlan.name,
          category1: 'SaaS',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: selectedPlan.price,
        },
      ],
    }

    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(paymentRequest, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    console.log('iyzico response status:', result.status)
    if (result.status !== 'success') {
      console.error('iyzico error:', JSON.stringify(result))
    }

    if (result.status === 'success') {
      return Response.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        tokenExpireTime: result.tokenExpireTime,
      })
    } else {
      return Response.json({
        error: result.errorMessage || 'iyzico ödeme başlatılamadı',
        errorCode: result.errorCode,
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Initialize error:', error)
    return Response.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 })
  }
}
