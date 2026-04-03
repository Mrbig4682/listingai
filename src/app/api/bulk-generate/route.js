import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

export async function POST(request) {
  try {
    const { products, platform } = await request.json()

    if (!products?.length) {
      return Response.json({ error: 'En az bir ürün gerekli.' }, { status: 400 })
    }

    if (products.length > 10) {
      return Response.json({ error: 'Tek seferde en fazla 10 ürün gönderilebilir.' }, { status: 400 })
    }

    // Kota kontrolü
    const supabase = getSupabase()
    let currentUser = null
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        currentUser = user
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('plan, listings_used, listings_limit')
          .eq('id', user.id)
          .single()

        if (profile) {
          const remaining = (profile.listings_limit || 10) - (profile.listings_used || 0)
          if (remaining < products.length) {
            return Response.json({
              error: `Kalan hakkınız ${remaining}, ${products.length} ürün için yeterli değil. Planınızı yükseltin.`,
              quotaExceeded: true,
            }, { status: 403 })
          }
        }
      }
    }

    const platformName = platform === 'hepsiburada' ? 'Hepsiburada' : platform === 'n11' ? 'N11' : 'Trendyol'
    const maxChars = platform === 'hepsiburada' ? 200 : 150
    const anthropic = getAnthropic()

    const results = []

    for (const product of products) {
      try {
        const prompt = `Sen bir Türk e-ticaret listing uzmanısın. ${platformName} platformu için optimize edilmiş listing oluştur.

Ürün: ${product.name}
${product.brand ? `Marka: ${product.brand}` : ''}
${product.features ? `Özellikler: ${product.features}` : ''}

Platform kuralları: Başlık max ${maxChars} karakter. SEO uyumlu, profesyonel Türkçe.

SADECE JSON:
{"title": "...", "bullets": ["...", "...", "...", "...", "..."], "description": "...", "seo_score": 0}`

        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }],
        })

        const text = message.content[0].text.trim()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text)

        results.push({
          product_name: product.name,
          brand: product.brand || '',
          status: 'success',
          ...parsed,
        })

        // DB'ye kaydet
        if (currentUser) {
          const { data: listing } = await supabase
            .from('listings')
            .insert({
              user_id: currentUser.id,
              product_name: product.name,
              brand: product.brand || '',
              category: product.category || '',
              features: product.features || '',
              platforms: [platform],
            })
            .select().single()

          if (listing) {
            await supabase.from('listing_results').insert({
              listing_id: listing.id,
              platform,
              title: parsed.title,
              bullets: parsed.bullets,
              description: parsed.description,
              seo_score: parsed.seo_score || 75,
            })
          }
        }
      } catch (err) {
        results.push({
          product_name: product.name,
          status: 'error',
          error: 'Bu ürün için listing üretilemedi.',
        })
      }
    }

    // Kota güncelle
    if (currentUser) {
      const successCount = results.filter(r => r.status === 'success').length
      if (successCount > 0) {
        const { data: prof } = await supabase.from('user_profiles').select('listings_used').eq('id', currentUser.id).single()
        if (prof) {
          await supabase.from('user_profiles').update({ listings_used: (prof.listings_used || 0) + successCount }).eq('id', currentUser.id)
        }
      }
    }

    return Response.json({
      results,
      total: products.length,
      success: results.filter(r => r.status === 'success').length,
    })
  } catch (error) {
    console.error('Bulk generate error:', error)
    return Response.json({ error: 'Toplu üretim sırasında hata oluştu.' }, { status: 500 })
  }
}
