import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

function getPlanDetails(planName) {
  const plans = {
    starter: { limit: 2, duration: 365 },
    pro: { limit: 100, duration: 30 },
    business: { limit: 999999, duration: 30 },
  }
  return plans[planName] || null
}

export async function POST(request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature')
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    if (!secret) {
      console.error('LS webhook: missing webhook secret')
      return Response.json({ error: 'Configuration error' }, { status: 500 })
    }

    // Signature doğrulama — HMAC-SHA256 hex
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('LS webhook: invalid signature')
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventName = event.meta?.event_name

    console.log('LS webhook received:', eventName)

    // order_completed — tek seferlik ödeme başarılı
    // subscription_payment_success — abonelik ödemesi başarılı
    if (eventName === 'order_completed' || eventName === 'subscription_payment_success') {
      const customData = event.meta?.custom_data || {}
      const userId = customData.user_id
      const plan = customData.plan

      if (!userId || !plan) {
        // Custom data yoksa order attributes'dan bulmayı dene
        console.error('LS webhook: missing custom_data', { eventName, meta: event.meta })
        return Response.json({ received: true })
      }

      const planDetails = getPlanDetails(plan)
      if (!planDetails) {
        console.error('LS webhook: invalid plan:', plan)
        return Response.json({ received: true })
      }

      const supabase = getSupabase()

      // Ödeme kaydını güncelle — en son pending kaydı bul
      const { data: payment } = await supabase
        .from('shopier_payments')
        .select('id')
        .eq('user_id', userId)
        .eq('plan', plan)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (payment) {
        await supabase
          .from('shopier_payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            platform_order_id: `ls_${event.data?.id || 'unknown'}`,
          })
          .eq('id', payment.id)
      }

      // Plan süresini hesapla
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + planDetails.duration)

      // User profile güncelle
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          plan: plan,
          listings_limit: planDetails.limit,
          listings_used: 0,
          plan_started_at: new Date().toISOString(),
          plan_expires_at: expiry.toISOString(),
        })
        .eq('id', userId)

      if (updateError) {
        console.error('CRITICAL: LS payment received but profile update failed!', {
          userId, plan, error: updateError,
        })
      } else {
        console.log('LS payment successful:', { userId, plan })
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('LS webhook error:', error)
    return Response.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
