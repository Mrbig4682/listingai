import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

// TEMPORARY admin endpoint — remove after use
export async function POST(request) {
  try {
    const { userId, plan, secret } = await request.json()

    // Simple secret protection
    if (secret !== 'listingai-temp-2026') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const planDetails = {
      starter: { limit: 2, duration: 365 },
      pro: { limit: 100, duration: 30 },
      business: { limit: 999999, duration: 30 },
    }

    const details = planDetails[plan]
    if (!details || !userId) {
      return Response.json({ error: 'Invalid plan or userId' }, { status: 400 })
    }

    const supabase = getSupabase()
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + details.duration)

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        plan: plan,
        listings_limit: details.limit,
        listings_used: 0,
        plan_started_at: new Date().toISOString(),
        plan_expires_at: expiry.toISOString(),
      })
      .eq('id', userId)
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Also update payment record
    await supabase
      .from('shopier_payments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        platform_order_id: 'ls_manual_8089698',
      })
      .eq('user_id', userId)
      .eq('plan', plan)
      .eq('status', 'pending')

    return Response.json({ success: true, profile: data })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
