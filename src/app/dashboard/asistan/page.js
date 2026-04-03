'use client'
import { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n/context'

export default function AsistanPage() {
  const { t } = useI18n()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const QUICK_PROMPTS = [
    { icon: '📈', text: t.chat.q1 },
    { icon: '🔑', text: t.chat.q2 },
    { icon: '📸', text: t.chat.q3 },
    { icon: '💰', text: t.chat.q4 },
    { icon: '⭐', text: t.chat.q5 },
    { icon: '🏷️', text: t.chat.q6 },
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()
      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Bir hata oluştu, tekrar deneyin.' }])
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Bağlantı hatası, tekrar deneyin.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-lg">🤖</div>
        <div>
          <h2 className="text-lg font-bold">{t.chat.title}</h2>
          <p className="text-xs text-gray-400">{t.chat.subtitle}</p>
        </div>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🤖</div>
              <h3 className="font-bold text-lg mb-1">{t.chat.greeting}</h3>
              <p className="text-sm text-gray-500 max-w-md">{t.chat.greetingSub}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p.text)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-left hover:border-brand-300 hover:bg-brand-50 transition">
                  <span>{p.icon}</span>
                  <span className="text-gray-700 line-clamp-1">{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-500 text-white rounded-br-md'
                  : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 pt-3">
        <div className="flex gap-2">
          <textarea ref={inputRef} rows={1} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chat.placeholder}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            style={{ maxHeight: '120px' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="px-4 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            ➤
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">{t.chat.disclaimer}</p>
      </div>
    </div>
  )
}
