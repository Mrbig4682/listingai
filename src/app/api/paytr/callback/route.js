import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

function getPlanFromOid(merchantOid) {
  // merchantOid format: userId_plan_timestamp
  const parts = merchantOid.split('_')
  if (parts.length >= 2) return parts[1]
  return null
}

function getUserIdFromOid(merchantOid) {
  const parts = merchantOid.split('_')
  if (parts.length >= 1) return parts[0]
  return null
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
    const formData = await request.formData()
    const merchantOid = formData.get('merchant_oid')
    const status = formData.get('status')
    const totalAmount = formData.get('total_amount')
    const hash = formData.get('hash')

    const merchantKey = process.env.PAYTR_MERCHANT_KEY
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT

    if (!merchantKey || !merchantSalt) {
      console.error('PayTR callback: missing merchant credentials')
      return new Response('OK', { status: 200 })
    }

    // Hash doğrulama
    const hashStr = merchantOid + merchantSalt + status + totalAmount
    const expectedHash = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64')

    if (hash !== expectedHash) {
      console.error('PayTR callback: invalid hash')
      return new Response('OK', { status: 200 })
    }

    const supabase = getSupabase()

    if (status === 'success') {
      const plan = getPlanFromOid(merchantOid)
      const planDetails = getPlanDetails(plan)

      if (!plan || !planDetails) {
        console.error('PayTR callback: invalid plan from oid:', merchantOid)
        return new Response('OK', { status: 200 })
      }

      // Ödeme kaydından userId'yi bul
      const { data: payment } = await supabase
        .from('shopier_payments')
        .select('user_id')
        .eq('platform_order_id', merchantOid)
        .single()

      if (!payment) {
        console.error('PayTR callback: no matching payment for:', merchantOid)
        return new Response('OK', { status: 200 })
      }

      const userId = payment.user_id

      // Ödeme kaydını güncelle
      await supabase
        .from('shopier_payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('platform_order_id', merchantOid)

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
        console.error('CRITICAL: PayTR payment received but profile update failed!', {
          userId, plan, merchantOid, error: updateError,
        })
      }

      console.log('PayTR payment successful:', { userId, plan, merchantOid })
    } else {
      // Başarısız ödeme
      await supabase
        .from('shopier_payments')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
        })
        .eq('platform_order_id', merchantOid)

      console.log('PayTR payment failed:', merchantOid)
    }

    // PayTR "OK" yanıtı bekler
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('PayTR callback error:', error)
    return new Response('OK', { status: 200 })
  }
}
