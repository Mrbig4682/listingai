import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

function generateRandomString() {
  return crypto.randomBytes(16).toString('hex')
}

function getAuthorizationHeader(apiKey, secretKey, requestBody) {
  const randomString = generateRandomString()
  const hashInput = apiKey + randomString + secretKey + JSON.stringify(requestBody)
  const hashStr = crypto.createHash('sha1').update(hashInput).digest('base64')
  return {
    authorization: `IYZWS ${apiKey}:${hashStr}`,
    xIyziRnd: randomString,
  }
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

    const selectedPlan = PLANS[plan]
    const basketId = `LISTINGAI_${plan.toUpperCase()}_${Date.now()}`
    const conversationId = `${userId}_${Date.now()}`

    // Callback URL - Vercel'deki URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://listingai-gamma.vercel.app'

    const requestData = {
      locale: 'tr',
      conversationId: conversationId,
      price: selectedPlan.price,
      paidPrice: selectedPlan.price,
      currency: 'TRY',
      basketId: basketId,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${baseUrl}/api/iyzico/callback`,
      enabledInstallments: [1, 2, 3, 6],
      buyer: {
        id: userId,
        name: userEmail.split('@')[0],
        surname: 'ListingAI',
        gsmNumber: '+905350000000',
        email: userEmail,
        identityNumber: '11111111111',
        registrationAddress: 'Istanbul, Turkey',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: userEmail.split('@')[0],
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul, Turkey',
      },
      billingAddress: {
        contactName: userEmail.split('@')[0],
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul, Turkey',
      },
      basketItems: [
        {
          id: plan,
          name: selectedPlan.name,
          category1: 'SaaS Abonelik',
          itemType: 'VIRTUAL',
          price: selectedPlan.price,
        },
      ],
    }

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

    // iyzico API'ye HTTP çağrısı yap
    const apiKey = process.env.IYZICO_API_KEY || 'sandbox-placeholder'
    const secretKey = process.env.IYZICO_SECRET_KEY || 'sandbox-placeholder'
    const baseUrl_api = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

    const authHeaders = getAuthorizationHeader(apiKey, secretKey, requestData)

    const response = await fetch(`${baseUrl_api}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
      method: 'POST',
      headers: {
        'Authorization': authHeaders.authorization,
        'x-iyzi-rnd': authHeaders.xIyziRnd,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

    if (result.status === 'success') {
      return Response.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        tokenExpireTime: result.tokenExpireTime,
      })
    } else {
      console.error('iyzico result error:', result)
      return Response.json({
        error: result.errorMessage || 'iyzico hatası',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Initialize error:', error)
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
