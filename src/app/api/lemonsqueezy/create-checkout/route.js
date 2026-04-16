import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

// Lemon Squeezy variant ID'leri — hesap açıldıktan sonra doldurulacak
const PLAN_VARIANTS = {
  starter: process.env.LS_VARIANT_STARTER,
  pro: process.env.LS_VARIANT_PRO,
  business: process.env.LS_VARIANT_BUSINESS,
}

const PLANS = {
  starter: { price: 0, limit: 2, duration: 0 },        // Ücretsiz
  pro: { price: 19.90, limit: 100, duration: 30 },     // 19.90 TL
  business: { price: 49.90, limit: 999999, duration: 30 }, // 49.90 TL
}

export async function POST(request) {
  try {
    const { plan, userId, userEmail, userName } = await request.json()

    if (!plan || !PLAN_VARIANTS[plan]) {
      return Response.json({ error: 'Geçersiz plan' }, { status: 400 })
    }
    if (!userId || !userEmail) {
      return Response.json({ error: 'Kullanıcı bilgisi eksik' }, { status: 400 })
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'Ödeme sistemi yapılandırma hatası' }, { status: 500 })
    }

    const variantId = PLAN_VARIANTS[plan]
    if (!variantId) {
      return Response.json({ error: 'Plan variant bulunamadı' }, { status: 500 })
    }

    const storeId = process.env.LS_STORE_ID
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.listingai.store'

    // Lemon Squeezy Checkout oluştur
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: userEmail,
              name: userName || userEmail.split('@')[0],
              custom: {
                user_id: userId,
                plan: plan,
              },
            },
            checkout_options: {
              dark: false,
              logo: true,
              embed: false,
            },
            product_options: {
              redirect_url: `${baseUrl}/dashboard/odeme/sonuc?status=success&message=${plan}`,
              receipt_link_url: `${baseUrl}/dashboard/odeme/sonuc?status=success&message=${plan}`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    })

    const result = await response.json()

    if (result.data?.attributes?.url) {
      // Supabase'e ödeme kaydı
      const supabase = getSupabase()
      const orderId = `ls_${userId.substring(0, 8)}_${plan}_${Date.now()}`

      await supabase.from('shopier_payments').insert({
        user_id: userId,
        user_email: userEmail,
        plan: plan,
        amount: PLANS[plan].price,
        platform_order_id: orderId,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

      return Response.json({
        checkoutUrl: result.data.attributes.url,
      })
    } else {
      console.error('Lemon Squeezy error:', result)
      return Response.json({
        error: result.errors?.[0]?.detail || 'Checkout oluşturulamadı',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Lemon Squeezy create-checkout error:', error)
    return Response.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 })
  }
}
