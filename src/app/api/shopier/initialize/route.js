import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

const PLANS = {
  starter: { name: 'ListingAI Starter - Trial', price: '1.00', limit: 2 },
  pro: { name: 'ListingAI Pro - Monthly', price: '19.00', limit: 100 },
  business: { name: 'ListingAI Business - Monthly', price: '49.00', limit: 999999 },
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail, userName } = await request.json()

    if (!plan || !PLANS[plan]) {
      return Response.json({ error: 'Gecersiz plan' }, { status: 400 })
    }

    if (!userId || !userEmail) {
      return Response.json({ error: 'Kullanici bilgisi eksik' }, { status: 400 })
    }

    const apiKey = process.env.SHOPIER_API_KEY
    const apiSecret = process.env.SHOPIER_API_SECRET

    if (!apiKey || !apiSecret) {
      return Response.json({ error: 'Shopier yapilandirmasi eksik' }, { status: 500 })
    }

    const selectedPlan = PLANS[plan]
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://listingai-gamma.vercel.app'}/api/shopier/callback`

    const platformOrderId = `${userId}__${plan}__${Date.now()}`
    const randomNr = Math.floor(100000 + Math.random() * 900000).toString()
    const currency = '1' // 0=TL, 1=USD, 2=EUR
    const totalOrderValue = selectedPlan.price

    const dataToHash = randomNr + platformOrderId + totalOrderValue + currency
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(dataToHash)
      .digest('base64')

    const nameParts = (userName || userEmail.split('@')[0] || 'Musteri').split(' ')
    const buyerName = nameParts[0] || 'Musteri'
    const buyerSurname = nameParts.slice(1).join(' ') || '.'

    const formParams = {
      API_key: apiKey,
      website_index: '1',
      platform_order_id: platformOrderId,
      product_name: selectedPlan.name,
      product_type: '2',
      buyer_name: buyerName,
      buyer_surname: buyerSurname,
      buyer_email: userEmail,
      buyer_account_age: '1',
      buyer_id_nr: '0',
      buyer_phone: '05000000000',
      billing_address: 'Dijital Urun',
      billing_city: 'Istanbul',
      billing_country: 'TR',
      billing_postcode: '34000',
      shipping_address: 'Dijital Urun',
      shipping_city: 'Istanbul',
      shipping_country: 'TR',
      shipping_postcode: '34000',
      total_order_value: totalOrderValue,
      currency: currency,
      platform: '0',
      is_in_frame: '0',
      current_language: '0',
      modul_version: '1.0.4',
      random_nr: randomNr,
      signature: signature,
      callback: callbackUrl,
    }

    const supabase = getSupabase()
    await supabase.from('shopier_payments').insert({
      user_id: userId,
      user_email: userEmail,
      plan: plan,
      amount: parseFloat(totalOrderValue),
      platform_order_id: platformOrderId,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    const paymentUrl = 'https://www.shopier.com/ShowProduct/api_pay4.php'
    let inputsHtml = ''
    for (const [key, value] of Object.entries(formParams)) {
      inputsHtml += `<input type="hidden" name="${key}" value="${value}">\n`
    }

    const formHtml = `
      <form id="shopier_payment_form" method="post" action="${paymentUrl}">
        ${inputsHtml}
      </form>
      <script>document.getElementById("shopier_payment_form").submit();</script>
    `

    return Response.json({
      success: true,
      formHtml: formHtml,
      paymentUrl: paymentUrl,
      formParams: formParams,
    })
  } catch (error) {
    console.error('Shopier initialize error:', error)
    return Response.json({ error: 'Sunucu hatasi: ' + error.message }, { status: 500 })
  }
}
