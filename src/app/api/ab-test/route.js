import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(request) {
  try {
    const { titleA, titleB, bulletsA, bulletsB, descA, descB, platform } = await request.json()

    if (!titleA && !titleB) {
      return Response.json({ error: 'At least one listing version required.' }, { status: 400 })
    }

    const anthropic = getAnthropic()

    const prompt = `You are an e-commerce listing expert. Compare these two listing versions (A vs B) and provide detailed analysis.

Platform: ${platform || 'Amazon'}

VERSION A:
Title: ${titleA || 'Not provided'}
Bullets: ${bulletsA || 'Not provided'}
Description: ${descA || 'Not provided'}

VERSION B:
Title: ${titleB || 'Not provided'}
Bullets: ${bulletsB || 'Not provided'}
Description: ${descB || 'Not provided'}

Analyze both versions thoroughly. Return ONLY valid JSON:
{
  "version_a": {
    "seo_score": 72,
    "readability_score": 80,
    "conversion_score": 68,
    "keyword_density": 75,
    "overall_score": 74,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"]
  },
  "version_b": {
    "seo_score": 85,
    "readability_score": 78,
    "conversion_score": 82,
    "keyword_density": 80,
    "overall_score": 81,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"]
  },
  "comparison": {
    "winner": "B",
    "score_difference": 7,
    "summary": "Version B is stronger because...",
    "detailed_comparison": [
      {
        "category": "SEO Performance",
        "winner": "B",
        "explanation": "Explanation"
      },
      {
        "category": "Readability",
        "winner": "A",
        "explanation": "Explanation"
      },
      {
        "category": "Conversion Potential",
        "winner": "B",
        "explanation": "Explanation"
      },
      {
        "category": "Keyword Usage",
        "winner": "B",
        "explanation": "Explanation"
      }
    ]
  },
  "recommendations": [
    "Take the best of both versions...",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "merged_best": {
    "title": "The best possible title combining strengths of both",
    "bullets": ["bullet1", "bullet2", "bullet3", "bullet4", "bullet5"],
    "description": "The best possible description"
  }
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')

    const result = JSON.parse(jsonMatch[0])
    return Response.json({ result })
  } catch (error) {
    console.error('AB test error:', error)
    return Response.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}
