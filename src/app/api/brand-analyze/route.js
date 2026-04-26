import Anthropic from '@anthropic-ai/sdk'

// Next.js App Router route segment config — Vercel Hobby allows up to 60s
export const maxDuration = 60

function getAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  return new Anthropic({ apiKey: key })
}

export async function POST(request) {
  try {
    const { url, language = 'tr', country = 'Global' } = await request.json()

    if (!url) {
      return Response.json({ error: 'URL is required.' }, { status: 400 })
    }

    // Try to fetch website content for analysis
    let websiteContent = ''
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ListingAI/1.0)' },
        signal: AbortSignal.timeout(10000),
      })
      const html = await res.text()
      // Extract text content (strip HTML tags, limit to 5000 chars)
      websiteContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000)
    } catch (e) {
      websiteContent = `Could not fetch website content. URL provided: ${url}`
    }

    const anthropic = getAnthropic()

    const prompt = `CRITICAL: You MUST respond entirely in ${language} language. All text values in the JSON must be in ${language}.

You are a brand strategy expert and business intelligence analyst. Analyze the following website/business and create a comprehensive "Brand DNA" profile.

Website URL: ${url}
Website Content (extracted text): ${websiteContent}
Target Market: ${country}

Based on ALL available information, create a detailed Brand DNA profile. If the website content is limited, use the URL and domain to infer what you can, and note what's inferred vs confirmed.

Return ONLY valid JSON in this exact format:
{
  "brand_name": "Company/Brand name",
  "tagline": "A short tagline or value proposition",
  "industry": "Primary industry/sector",
  "brand_personality": {
    "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
    "tone_of_voice": "Description of brand's communication style",
    "archetype": "Brand archetype (e.g., Hero, Creator, Explorer, etc.)"
  },
  "target_audience": {
    "primary": "Primary target audience description",
    "demographics": "Age, gender, income level",
    "psychographics": "Interests, values, lifestyle"
  },
  "value_proposition": {
    "main": "Main value proposition",
    "differentiators": ["diff1", "diff2", "diff3"]
  },
  "visual_identity": {
    "color_palette": ["#hex1", "#hex2", "#hex3"],
    "style": "Visual style description (modern, classic, playful, etc.)"
  },
  "market_positioning": {
    "segment": "premium/mid-range/budget",
    "competitors": [
      { "name": "competitor1", "website_url": "https://..." },
      { "name": "competitor2", "website_url": "https://..." },
      { "name": "competitor3", "website_url": "https://..." }
    ],
    "competitive_advantage": "What makes this brand unique"
  },
  "listing_recommendations": {
    "tone": "Recommended tone for product listings",
    "keywords_strategy": "SEO keyword approach recommendation",
    "title_style": "How titles should be structured",
    "description_style": "How descriptions should be written",
    "sample_title_template": "A sample title template for this brand",
    "sample_bullets": ["Sample bullet 1", "Sample bullet 2", "Sample bullet 3"]
  },
  "brand_score": {
    "overall": 75,
    "online_presence": 70,
    "brand_clarity": 80,
    "market_fit": 75
  },
  "improvement_tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid AI response format')
    }

    const result = JSON.parse(jsonMatch[0])
    return Response.json({ result })
  } catch (error) {
    console.error('Brand analyze error:', error)
    return Response.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}
