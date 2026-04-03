import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

function generateRandomString() {
  return crypto.randomBytes(8).toString('hex')
}

// iyzico PKI string formatı - JSON değil, key=value formatında
function toPkiString(obj) {
  if (obj === null || obj === undefined) return ''
  if (Array.isArray(obj)) {
    let result = '['
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object' && obj[i] !== null) {
        result += toPkiString(obj[i])
      } else {
        result += obj[i]
      }
      if (i < obj.length - 1) result += ', '
    }
    result += ']'
    return result
  }
  if (typeof obj === 'object') {
    let result = '['
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = obj[key]
      if (value === null || value === undefined) continue
      if (typeof value === 'object') {
        result += key + '=' + toPkiString(value)
      } else {
        result += key + '=' + value
      }
      if (i < keys.length - 1) result += ','
    }
    result += ']'
    return result
  }
  return String(obj)
}

function getAuthorizationHeader(apiKey, secretKey, requestData) {
  const randomString = generateRandomString()
  const pkiString = toPkiString(requestData)
  const hashInput = apiKey + randomString + secretKey + pkiString
  const hashStr = crypto.createHash('sha1').update(hashInput, 'utf8').digest('base64')
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
    const conversationId = `${userId.substring(0, 8)}_${Date.now()}`

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

    // iyzico API çağrısı
    const apiKey = process.env.IYZICO_API_KEY
    const secretKey = process.env.IYZICO_SECRET_KEY
    const baseUrlApi = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

    if (!apiKey || !secretKey) {
      console.error('iyzico API keys missing')
      return Response.json({ error: 'Ödeme sistemi yapılandırma hatası' }, { status: 500 })
    }

    const authHeaders = getAuthorizationHeader(apiKey, secretKey, requestData)

    const response = await fetch(`${baseUrlApi}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
      method: 'POST',
      headers: {
        'Authorization': authHeaders.authorization,
        'x-iyzi-rnd': authHeaders.xIyziRnd,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

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
