"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Save, CheckCircle, MessageCircle, Mail, Instagram, Youtube, Type, Key, Webhook, Link2, Copy } from "lucide-react"

type Config = {
  whatsapp: string
  email_contato: string
  instagram: string
  youtube: string
  texto_hero: string
  subtitulo_hero: string
  webhook_secret: string
  zapier_webhook_url: string
}

export default function AdminConfigPage() {
  const [config, setConfig] = useState<Config>({
    whatsapp: "",
    email_contato: "",
    instagram: "",
    youtube: "",
    texto_hero: "",
    subtitulo_hero: "",
    webhook_secret: "",
    zapier_webhook_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Seção de senha
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    const supabase = createClient()
    const { data } = await supabase.from("config").select("*").eq("id", "site").single()
    if (data) {
      setConfig({
        whatsapp: data.whatsapp ?? "",
        email_contato: data.email_contato ?? "",
        instagram: data.instagram ?? "",
        youtube: data.youtube ?? "",
        texto_hero: data.texto_hero ?? "",
        subtitulo_hero: data.subtitulo_hero ?? "",
        webhook_secret: data.webhook_secret ?? "",
        zapier_webhook_url: data.zapier_webhook_url ?? "",
      })
    }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const { error: err } = await supabase.from("config").update(config).eq("id", "site")

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError("As senhas não coincidem.")
      setPasswordLoading(false)
      return
    }

    if (passwordForm.new.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.")
      setPasswordLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: passwordForm.new })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setPasswordForm({ current: "", new: "", confirm: "" })
      setTimeout(() => setPasswordSuccess(false), 3000)
    }
    setPasswordLoading(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie as informações do site</p>
      </div>

      {/* Configurações do site */}
      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 mb-8">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <Type size={18} className="text-cyan" />
          Informações do Site
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* WhatsApp */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
              <MessageCircle size={12} />
              WhatsApp
            </label>
            <input
              type="text"
              value={config.whatsapp}
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
              placeholder="+5511999999999"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
            />
            <p className="text-[10px] text-muted-foreground">Formato: +5511999999999 (com código do país)</p>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
              <Mail size={12} />
              E-mail de Contato
            </label>
            <input
              type="email"
              value={config.email_contato}
              onChange={(e) => setConfig({ ...config, email_contato: e.target.value })}
              placeholder="contato@exemplo.com"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
              <Instagram size={12} />
              Instagram
            </label>
            <input
              type="text"
              value={config.instagram}
              onChange={(e) => setConfig({ ...config, instagram: e.target.value })}
              placeholder="https://instagram.com/seu_perfil"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
            />
          </div>

          {/* YouTube */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
              <Youtube size={12} />
              YouTube
            </label>
            <input
              type="text"
              value={config.youtube}
              onChange={(e) => setConfig({ ...config, youtube: e.target.value })}
              placeholder="https://youtube.com/@seu_canal"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
            />
          </div>
        </div>

        {/* Textos da Home */}
        <div className="border-t border-border pt-6 mt-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Textos da Página Inicial</h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Título Principal (Hero)
              </label>
              <input
                type="text"
                value={config.texto_hero}
                onChange={(e) => setConfig({ ...config, texto_hero: e.target.value })}
                placeholder="Domine a Arte do Reparo"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Subtítulo (Hero)
              </label>
              <textarea
                rows={2}
                value={config.subtitulo_hero}
                onChange={(e) => setConfig({ ...config, subtitulo_hero: e.target.value })}
                placeholder="Guias técnicos práticos criados por quem já reparou mais de 20 mil aparelhos."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botão salvar */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {saved && (
            <p className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle size={14} /> Salvo com sucesso!
            </p>
          )}
          {!error && !saved && <div />}
          
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-cyan/90 transition-all disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
            {!saving && <Save size={14} />}
          </button>
        </div>
      </form>

      {/* Alterar senha */}
      <form onSubmit={handleChangePassword} className="rounded-2xl border border-border bg-card p-6 mb-8">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <Key size={18} className="text-cyan" />
          Alterar Senha
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Nova Senha
            </label>
            <input
              type="password"
              required
              value={passwordForm.new}
              onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              required
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-surface border border-border text-foreground font-bold text-sm px-6 py-3 rounded-xl hover:border-cyan/30 hover:text-cyan transition-all disabled:opacity-60"
            >
              {passwordLoading ? "Alterando..." : "Alterar Senha"}
            </button>
          </div>
        </div>

        {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
        {passwordSuccess && (
          <p className="text-sm text-green-400 flex items-center gap-2">
            <CheckCircle size={14} /> Senha alterada com sucesso!
          </p>
        )}
      </form>

      {/* Integrações / Webhooks */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <Webhook size={18} className="text-cyan" />
          Integrações (Zapier / Webhooks)
        </h2>

        <div className="mb-6 p-4 rounded-xl bg-surface border border-border">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Link2 size={14} className="text-cyan" />
            URLs dos Webhooks (para configurar no Zapier)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background px-3 py-2 rounded-lg border border-border text-muted-foreground font-mono overflow-x-auto">
                {typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/cursos` : "/api/webhooks/cursos"}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/cursos`)}
                className="p-2 rounded-lg border border-border hover:border-cyan/30 hover:text-cyan transition-all"
                title="Copiar URL"
              >
                <Copy size={14} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Use GET para listar cursos, POST para criar, PUT para atualizar. Envie o token no header &quot;Authorization: Bearer SEU_TOKEN&quot;
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Webhook Secret (Token de Autenticação)
            </label>
            <input
              type="text"
              value={config.webhook_secret}
              onChange={(e) => setConfig({ ...config, webhook_secret: e.target.value })}
              placeholder="seu-token-secreto-aqui"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Token que o Zapier deve enviar no header para autenticar as requisições
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Zapier Webhook URL (Notificações)
            </label>
            <input
              type="text"
              value={config.zapier_webhook_url}
              onChange={(e) => setConfig({ ...config, zapier_webhook_url: e.target.value })}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              URL do webhook do Zapier para receber notificações quando cursos forem criados/atualizados
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-border">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-cyan/90 transition-all disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar Integrações"}
            {!saving && <Save size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
