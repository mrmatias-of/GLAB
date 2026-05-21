"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Send, MessageCircle, Mail, Clock, CheckCircle } from "lucide-react"

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await supabase.from("mensagens").insert({
      nome: form.nome.trim(),
      email: form.email.trim(),
      mensagem: form.mensagem.trim(),
    })

    if (err) {
      setError("Erro ao enviar mensagem. Tente novamente.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">Suporte</p>
          <h1 className="section-title mb-4">Fale Conosco</h1>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: '#71717a' }}>
            Dúvidas sobre os guias, suporte técnico ou qualquer outro assunto — estamos aqui para ajudar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Canais */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Canais de atendimento</h2>

            <a
              href="https://wa.me/5519989398294"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300"
              style={{ backgroundColor: '#111113', border: '1px solid #27272a' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#4f46e5')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#27272a')}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}>
                <MessageCircle size={20} style={{ color: '#25D366' }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">WhatsApp</p>
                <p className="text-xs" style={{ color: '#71717a' }}>Resposta rápida durante o horário comercial</p>
              </div>
            </a>

            <a
              href="mailto:contato@glabcursos.com.br"
              className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300"
              style={{ backgroundColor: '#111113', border: '1px solid #27272a' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#4f46e5')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#27272a')}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(79,70,229,0.25)' }}>
                <Mail size={20} style={{ color: '#818cf8' }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">E-mail</p>
                <p className="text-sm" style={{ color: '#818cf8' }}>contato@glabcursos.com.br</p>
                <p className="text-xs mt-1" style={{ color: '#71717a' }}>Respondemos em até 24 horas úteis</p>
              </div>
            </a>

            <div
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ backgroundColor: '#111113', border: '1px solid #27272a' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(39,39,42,0.8)', border: '1px solid #3f3f46' }}>
                <Clock size={20} style={{ color: '#71717a' }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">Horário de atendimento</p>
                <p className="text-sm" style={{ color: '#a1a1aa' }}>Segunda a Sexta — 9h às 18h</p>
                <p className="text-xs mt-1" style={{ color: '#71717a' }}>Fuso horário de Brasília (BRT)</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="rounded-2xl p-7" style={{ backgroundColor: '#111113', border: '1px solid #27272a' }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)' }}>
                  <CheckCircle size={28} style={{ color: '#818cf8' }} />
                </div>
                <h3 className="text-xl font-black text-white">Mensagem enviada!</h3>
                <p className="text-sm max-w-xs" style={{ color: '#71717a' }}>
                  Recebemos sua mensagem e entraremos em contato em breve.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nome: "", email: "", mensagem: "" }) }}
                  className="mt-2 text-sm transition-colors hover:text-white"
                  style={{ color: '#818cf8' }}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="text-lg font-black text-white mb-1">Envie uma mensagem</h3>

                {[
                  { label: "Nome", field: "nome", type: "text", placeholder: "Seu nome completo" },
                  { label: "E-mail", field: "email", type: "email", placeholder: "seu@email.com" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#71717a' }}>{label}</label>
                    <input
                      type={type}
                      required
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                      style={{ backgroundColor: '#0B0B0C', border: '1px solid #27272a' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#71717a' }}>Mensagem</label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    placeholder="Como podemos ajudar?"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all resize-none"
                    style={{ backgroundColor: '#0B0B0C', border: '1px solid #27272a' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
                  />
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                  {!loading && <Send size={14} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
