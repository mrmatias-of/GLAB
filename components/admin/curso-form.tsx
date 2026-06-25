"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import SimpleImageUpload from "@/components/admin/simple-image-upload"
import Link from "next/link"

type Modulo = { titulo: string; topicos: string[] }

type CursoFormData = {
  slug: string
  tag: string
  titulo: string
  subtitulo: string
  descricao: string
  descricao_longa: string
  imagem: string
  preco: string
  preco_original: string
  cta: string
  cta_href: string
  destaque: boolean
  ativo: boolean
  ordem: number
  modulos: Modulo[]
  aprendizados: string[]
}

const defaultForm: CursoFormData = {
  slug: "",
  tag: "Guia",
  titulo: "",
  subtitulo: "",
  descricao: "",
  descricao_longa: "",
  imagem: "",
  preco: "",
  preco_original: "",
  cta: "Quero Acessar o Guia",
  cta_href: "",
  destaque: false,
  ativo: true,
  ordem: 0,
  modulos: [],
  aprendizados: [],
}

// Sanitiza string removendo caracteres perigosos
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Valida URL
function isValidUrl(str: string): boolean {
  if (!str) return true // URL vazia é válida (campo opcional)
  try {
    const url = new URL(str)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export default function CursoForm({ initialData, id }: { initialData?: Partial<CursoFormData> & { id?: string }, id?: string }) {
  const isEditing = !!id
  const [form, setForm] = useState<CursoFormData>({ ...defaultForm, ...initialData })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function set(field: keyof CursoFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Módulos
  function addModulo() {
    set("modulos", [...form.modulos, { titulo: "", topicos: [""] }])
  }
  function removeModulo(i: number) {
    set("modulos", form.modulos.filter((_, idx) => idx !== i))
  }
  function updateModulo(i: number, field: keyof Modulo, value: string | string[]) {
    const updated = [...form.modulos]
    updated[i] = { ...updated[i], [field]: value }
    set("modulos", updated)
  }
  function addTopico(i: number) {
    const updated = [...form.modulos]
    updated[i].topicos = [...updated[i].topicos, ""]
    set("modulos", updated)
  }
  function removeTopico(modIdx: number, topIdx: number) {
    const updated = [...form.modulos]
    updated[modIdx].topicos = updated[modIdx].topicos.filter((_, idx) => idx !== topIdx)
    set("modulos", updated)
  }
  function updateTopico(modIdx: number, topIdx: number, value: string) {
    const updated = [...form.modulos]
    updated[modIdx].topicos[topIdx] = value
    set("modulos", updated)
  }

  // Aprendizados
  function addAprendizado() {
    set("aprendizados", [...form.aprendizados, ""])
  }
  function removeAprendizado(i: number) {
    set("aprendizados", form.aprendizados.filter((_, idx) => idx !== i))
  }
  function updateAprendizado(i: number, value: string) {
    const updated = [...form.aprendizados]
    updated[i] = value
    set("aprendizados", updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validar URL do checkout
    if (form.cta_href && !isValidUrl(form.cta_href)) {
      setError("Link de checkout inválido. Use uma URL completa (https://...)")
      setLoading(false)
      return
    }

    // Sanitizar todos os campos de texto
    const sanitizedPayload = {
      slug: sanitize(form.slug).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tag: sanitize(form.tag),
      titulo: sanitize(form.titulo),
      subtitulo: sanitize(form.subtitulo),
      descricao: sanitize(form.descricao),
      descricao_longa: sanitize(form.descricao_longa),
      imagem: form.imagem.trim(),
      preco: sanitize(form.preco),
      preco_original: sanitize(form.preco_original),
      cta: sanitize(form.cta),
      cta_href: form.cta_href.trim(), // URL já validada
      destaque: form.destaque,
      ativo: form.ativo,
      ordem: form.ordem,
      modulos: form.modulos.map(m => ({
        titulo: sanitize(m.titulo),
        topicos: m.topicos.map(t => sanitize(t)).filter(t => t.length > 0)
      })).filter(m => m.titulo.length > 0),
      aprendizados: form.aprendizados.map(a => sanitize(a)).filter(a => a.length > 0),
    }

    const supabase = createClient()

    let cursoId = id
    let err
    
    if (isEditing) {
      const { error } = await supabase.from("cursos").update(sanitizedPayload).eq("id", id)
      err = error
    } else {
      const { data, error } = await supabase.from("cursos").insert(sanitizedPayload).select("id").single()
      err = error
      if (data) cursoId = data.id
    }

    if (err) {
      setLoading(false)
      setError(err.message)
      return
    }

    setLoading(false)
    setSuccess(true)
    
    // Revalidar cache de cursos
    try {
      await fetch('/api/revalidate', { method: 'POST' })
    } catch {
      // Ignora erro de revalidação
    }
    
    setTimeout(() => {
      router.push("/admin/cursos")
      router.refresh()
    }, 1000)
  }

  const inputClass = "w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
  const labelClass = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cursos" className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-cyan/30 transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground">{isEditing ? "Editar Guia" : "Novo Guia"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{isEditing ? form.titulo : "Preencha os dados do novo guia"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Informações básicas */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-black text-foreground mb-5">Informações Básicas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título</label>
              <input className={inputClass} value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex: Reparo em iPhone" required />
            </div>
            <div>
              <label className={labelClass}>Slug (URL)</label>
              <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="Ex: reparo-iphone" required />
            </div>
            <div>
              <label className={labelClass}>Tag</label>
              <input className={inputClass} value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="Ex: iPhone, Android, Combo" />
            </div>
            <div>
              <label className={labelClass}>Ordem de exibição</label>
              <input type="number" className={inputClass} value={form.ordem} onChange={(e) => set("ordem", Number(e.target.value))} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Subtítulo</label>
              <input className={inputClass} value={form.subtitulo} onChange={(e) => set("subtitulo", e.target.value)} placeholder="Frase curta de apoio" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descrição (card)</label>
              <textarea className={inputClass + " resize-none"} rows={2} value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Texto exibido no card da página inicial" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descrição longa</label>
              <textarea className={inputClass + " resize-none"} rows={3} value={form.descricao_longa} onChange={(e) => set("descricao_longa", e.target.value)} placeholder="Texto detalhado na página do guia" />
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.destaque} onChange={(e) => set("destaque", e.target.checked)} className="w-4 h-4 accent-[#00d4c8]" />
              <span className="text-sm text-foreground">Destaque (Mais Popular)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.ativo} onChange={(e) => set("ativo", e.target.checked)} className="w-4 h-4 accent-[#00d4c8]" />
              <span className="text-sm text-foreground">Ativo (visível no site)</span>
            </label>
          </div>
        </section>

        {/* Imagem de Capa */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-black text-foreground mb-1">Imagem de Capa / Card</h2>
          <p className="text-xs text-muted-foreground mb-4">Envie a imagem. O sistema otimiza automaticamente.</p>
          <SimpleImageUpload
            value={form.imagem}
            onChange={(url) => set("imagem", url)}
          />
        </section>

        {/* Preço e Checkout */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-black text-foreground mb-5">Preço & Checkout</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço</label>
              <input className={inputClass} value={form.preco} onChange={(e) => set("preco", e.target.value)} placeholder="Ex: R$ 19,90 ou Em breve" required />
            </div>
            <div>
              <label className={labelClass}>Preço original (riscado)</label>
              <input className={inputClass} value={form.preco_original} onChange={(e) => set("preco_original", e.target.value)} placeholder="Ex: R$ 47" />
            </div>
            <div>
              <label className={labelClass}>Texto do botão</label>
              <input className={inputClass} value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Ex: Quero Acessar o Guia" />
            </div>
            <div>
              <label className={labelClass}>Link de Checkout</label>
              <input className={inputClass} value={form.cta_href} onChange={(e) => set("cta_href", e.target.value)} placeholder="https://pay.kirvano.com/..." />
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-foreground">Módulos & Tópicos</h2>
            <button type="button" onClick={addModulo} className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan border border-cyan/25 hover:bg-cyan/10 px-3 py-1.5 rounded-lg transition-all">
              <Plus size={12} /> Módulo
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {form.modulos.map((mod, modIdx) => (
              <div key={modIdx} className="border border-border rounded-xl p-4 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    className={inputClass + " flex-1"}
                    value={mod.titulo}
                    onChange={(e) => updateModulo(modIdx, "titulo", e.target.value)}
                    placeholder={`Título do módulo ${modIdx + 1}`}
                  />
                  <button type="button" onClick={() => removeModulo(modIdx)} className="p-2 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-2 pl-2">
                  {mod.topicos.map((topico, topIdx) => (
                    <div key={topIdx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan/40 flex-shrink-0" />
                      <input
                        className={inputClass + " flex-1"}
                        value={topico}
                        onChange={(e) => updateTopico(modIdx, topIdx, e.target.value)}
                        placeholder={`Tópico ${topIdx + 1}`}
                      />
                      <button type="button" onClick={() => removeTopico(modIdx, topIdx)} className="p-1 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addTopico(modIdx)} className="text-xs text-muted-foreground hover:text-cyan transition-colors text-left pl-3 mt-1">
                    + Adicionar tópico
                  </button>
                </div>
              </div>
            ))}
            {form.modulos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum módulo. Clique em &quot;+ Módulo&quot; para adicionar.</p>
            )}
          </div>
        </section>

        {/* O que vai aprender */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-foreground">O que vai aprender</h2>
            <button type="button" onClick={addAprendizado} className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan border border-cyan/25 hover:bg-cyan/10 px-3 py-1.5 rounded-lg transition-all">
              <Plus size={12} /> Item
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.aprendizados.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan/40 flex-shrink-0" />
                <input
                  className={inputClass + " flex-1"}
                  value={item}
                  onChange={(e) => updateAprendizado(i, e.target.value)}
                  placeholder={`O que o aluno vai aprender ${i + 1}`}
                />
                <button type="button" onClick={() => removeAprendizado(i)} className="p-1 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {form.aprendizados.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum item. Clique em &quot;+ Item&quot; para adicionar.</p>
            )}
          </div>
        </section>

        {/* Erros e botão salvar */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">Salvo com sucesso! Redirecionando...</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-cyan text-background font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-cyan/90 shadow-[0_0_24px_rgba(0,212,200,0.3)] transition-all disabled:opacity-50 w-full md:w-auto"
        >
          <Save size={15} />
          {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Guia"}
        </button>
      </div>
    </form>
  )
}
