'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Validação básica
      if (!formData.nome.trim() || !formData.email.trim() || !formData.mensagem.trim()) {
        setError('Preencha todos os campos obrigatórios')
        setLoading(false)
        return
      }

      // Consentimento obrigatório
      if (!privacyAccepted) {
        setError('Para enviar sua mensagem, confirme a leitura da Política de Privacidade.')
        setLoading(false)
        return
      }

      // Enviar para API que notifica Telegram
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao enviar mensagem')
      }

      setSuccess(true)
      setPrivacyAccepted(false)
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' })
      setTimeout(() => setSuccess(false), 5000)

    } catch (err: any) {
      setError(err.message || 'Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Seu nome"
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            backgroundColor: '#1a1a1d',
            borderColor: '#27272a',
            color: '#fff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#818cf8'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#27272a'
          }}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            backgroundColor: '#1a1a1d',
            borderColor: '#27272a',
            color: '#fff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#818cf8'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#27272a'
          }}
        />
      </div>

      {/* Assunto */}
      <div>
        <label htmlFor="assunto" className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>
          Assunto
        </label>
        <input
          type="text"
          id="assunto"
          name="assunto"
          value={formData.assunto}
          onChange={handleChange}
          placeholder="Assunto da mensagem"
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            backgroundColor: '#1a1a1d',
            borderColor: '#27272a',
            color: '#fff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#818cf8'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#27272a'
          }}
        />
      </div>

      {/* Mensagem */}
      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>
          Mensagem *
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          placeholder="Sua mensagem aqui..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
          style={{
            backgroundColor: '#1a1a1d',
            borderColor: '#27272a',
            color: '#fff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#818cf8'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#27272a'
          }}
        />
      </div>

      {/* Mensagens de status */}
      {error && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
          ✓ Mensagem enviada com sucesso! Responderemos em breve.
        </div>
      )}

      {/* Consentimento de privacidade */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy-consent"
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-0.5 flex-shrink-0 w-4 h-4 rounded cursor-pointer"
          style={{ accentColor: '#00D4C8' }}
        />
        <label htmlFor="privacy-consent" className="text-xs leading-relaxed cursor-pointer" style={{ color: '#a1a1aa' }}>
          Li a{' '}
          <Link
            href="/privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-cyan-400 transition-colors"
            style={{ color: '#00D4C8' }}
          >
            Política de Privacidade
          </Link>{' '}
          e concordo com o uso dos meus dados para receber resposta à minha solicitação.
        </label>
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
        style={{
          backgroundColor: loading ? '#52525b' : '#818cf8',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Send size={18} />
        {loading ? 'Enviando...' : 'Enviar Mensagem'}
      </button>

      <p className="text-sm text-center" style={{ color: '#71717a' }}>
        Responderemos sua mensagem em breve via email.
      </p>
    </form>
  )
}
