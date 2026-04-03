import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(request) {
  try {
    const { title, description, bullets, platform } = await request.json()

    if (!title && !description) {
      return Response.json({ error: 'Başlık veya açıklama gerekli.' }, { status: 400 })
    }

    const platformName = platform === 'hepsiburada' ? 'Hepsiburada' : platform === 'n11' ? 'N11' : 'Trendyol'

    const prompt = `Sen bir Türk e-ticaret listing optimizasyon uzmanısın. Aşağıdaki mevcut listing'i analiz et ve ${platformName} platformu için optimize edilmiş versiyonunu üret.

MEVCUT LİSTİNG:
Başlık: ${title || 'Yok'}
${bullets ? `Özellikler:\n${bullets}` : ''}
${description ? `Açıklama:\n${description}` : ''}

Görevlerin:
1. Mevcut listing'i 0-100 arası puanla (current_score)
2. Sorunları tespit et ve listele (issues dizisi, her biri {problem, suggestion} objesi)
3. Optimize edilmiş başlık üret (optimized_title)
4. Optimize edilmiş 5 bullet point üret (optimized_bullets dizisi)
5. Optimize edilmiş açıklama üret (optimized_description)
6. Yeni versiyonu 0-100 arası puanla (new_score)
7. Genel değerlendirme yaz (summary, 2-3 cümle)

${platformName} kuralları:
${platform === 'trendyol' ? '- Başlık: Marka + Ürün + Özellikler (pipe | ile ayır), max 150 karakter' : ''}
${platform === 'hepsiburada' ? '- Başlık: Marka + Ürün + Özellikler (tire - ile ayır), max 200 karakter' : ''}
${platform === 'n11' ? '- Başlık: Marka + Ürün + Özellikler (pipe | ile ayır), max 150 karakter' : ''}
- SEO anahtar kelimelerini doğal şekilde yerleştir
- Türkçe karakter ve yazım kurallarına dikkat et
- Profesyonel ve satış odaklı dil kullan

SADECE aşağıdaki JSON formatında yanıt ver:
{"current_score": 0, "new_score": 0, "summary": "...", "issues": [{"problem": "...", "suggestion": "..."}], "optimized_title": "...", "optimized_bullets": ["..."], "optimized_description": "..."}`

    const message = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text.trim()
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      return Response.json({ error: 'AI yanıtı işlenemedi, tekrar deneyin.' }, { status: 500 })
    }

    return Response.json({ result: parsed })
  } catch (error) {
    console.error('Optimize error:', error)
    return Response.json({ error: 'Optimizasyon sırasında hata oluştu.' }, { status: 500 })
  }
}
