"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Header from "@/components/header"
import Footer from "@/components/footer"
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
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Page hero */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,212,200,0.09)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.35) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-5 text-center pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-glow" />
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan uppercase">Fale Conosco</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-balance mb-4">
            Estamos aqui para{" "}
            <span className="text-cyan glow-text">ajudar</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Dúvidas sobre os guias, suporte ou qualquer outro assunto — entre em contato.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-start">

          {/* Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-foreground">Canais de atendimento</h2>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5519989398294"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[rgba(0,212,200,0.1)] bg-surface hover:border-cyan/25 hover:shadow-[0_0_24px_rgba(0,212,200,0.08)] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-[#25D366]" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm mb-1">WhatsApp</p>
                <p className="text-xs text-muted-foreground mt-1">Resposta rápida durante o horário comercial</p>
              </div>
            </a>

            {/* E-mail */}
            <a
              href="mailto:contato@glabcursos.com.br"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[rgba(0,212,200,0.1)] bg-surface hover:border-cyan/25 hover:shadow-[0_0_24px_rgba(0,212,200,0.08)] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan/10 border border-cyan/25 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-cyan" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm mb-1">E-mail</p>
                <p className="text-muted-foreground text-sm">contato@glabcursos.com.br</p>
                <p className="text-xs text-muted-foreground mt-1">Respondemos em até 24 horas úteis</p>
              </div>
            </a>

            {/* Horário */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-[rgba(0,212,200,0.08)] bg-surface/50">
              <div className="w-11 h-11 rounded-xl bg-cyan/8 border border-cyan/15 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-cyan/70" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm mb-1">Horário de atendimento</p>
                <p className="text-muted-foreground text-sm">Segunda a Sexta — 9h às 18h</p>
                <p className="text-xs text-muted-foreground mt-1">Fuso horário de Brasília (BRT)</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="rounded-2xl border border-[rgba(0,212,200,0.12)] bg-surface p-7 card-premium">
            <span className="shimmer-inner" />
            {sent ? (
              <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center">
                  <CheckCircle size={28} className="text-cyan" />
                </div>
                <h3 className="text-xl font-black text-foreground">Mensagem enviada!</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Recebemos sua mensagem e entraremos em contato em breve.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nome: "", email: "", mensagem: "" }) }}
                  className="mt-2 text-sm text-cyan hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
                <h3 className="text-xl font-black text-foreground mb-1">Envie uma mensagem</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Nome</label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">E-mail</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Mensagem</label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    placeholder="Como podemos ajudar?"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-3.5 bg-cyan text-background hover:bg-cyan/90 shadow-[0_0_24px_rgba(0,212,200,0.3)] hover:shadow-[0_0_36px_rgba(0,212,200,0.45)] transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                  {!loading && <Send size={14} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
