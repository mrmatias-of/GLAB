"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Loader2, BookOpen, Check, Save, ArrowRight, Trash2 } from "lucide-react"

type GeneratedCourse = {
  titulo: string
  slug: string
  subtitulo: string
  descricao: string
  descricao_longa: string
  tag: string
  nivel: string
  aprendizados: string[]
  modulos: Array<{
    titulo: string
    descricao: string
    aulas: Array<{
      titulo: string
      descricao: string
      conteudo: string
      duracao_minutos: number
    }>
  }>
  copy_vendas: {
    headline: string
    subheadline: string
    beneficios: string[]
    garantia: string
    urgencia: string
  }
}

export default function AIGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [nivel, setNivel] = useState<"iniciante" | "intermediario" | "avancado">("iniciante")
  const [numModulos, setNumModulos] = useState(4)
  const [numAulas, setNumAulas] = useState(4)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setGenerating(true)
    setError("")
    setGeneratedCourse(null)

    try {
      const res = await fetch("/api/ai/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          nivel,
          numModulos,
          numAulasPorModulo: numAulas
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar curso")
      }

      setGeneratedCourse(data.course)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar curso")
    } finally {
      setGenerating(false)
    }
  }

  async function handleSaveCourse() {
    if (!generatedCourse) return
    setSaving(true)

    try {
      const supabase = createClient()

      // 1. Criar o curso
      const { data: curso, error: cursoError } = await supabase
        .from("cursos")
        .insert({
          titulo: generatedCourse.titulo,
          slug: generatedCourse.slug,
          subtitulo: generatedCourse.subtitulo,
          descricao: generatedCourse.descricao,
          descricao_longa: generatedCourse.descricao_longa,
          tag: generatedCourse.tag,
          nivel: generatedCourse.nivel,
          aprendizados: generatedCourse.aprendizados,
          modulos: generatedCourse.modulos.map(m => ({
            titulo: m.titulo,
            topicos: m.aulas.map(a => a.titulo)
          })),
          ativo: false, // Começa inativo para revisão
          total_aulas: generatedCourse.modulos.reduce((acc, m) => acc + m.aulas.length, 0),
          duracao_total_minutos: generatedCourse.modulos.reduce(
            (acc, m) => acc + m.aulas.reduce((a, l) => a + l.duracao_minutos, 0), 0
          )
        })
        .select()
        .single()

      if (cursoError) throw cursoError

      // 2. Criar módulos
      for (let i = 0; i < generatedCourse.modulos.length; i++) {
        const mod = generatedCourse.modulos[i]
        
        const { data: modulo, error: modError } = await supabase
          .from("modules")
          .insert({
            curso_id: curso.id,
            titulo: mod.titulo,
            descricao: mod.descricao,
            ordem: i
          })
          .select()
          .single()

        if (modError) throw modError

        // 3. Criar aulas do módulo
        for (let j = 0; j < mod.aulas.length; j++) {
          const aula = mod.aulas[j]
          
          const { error: aulaError } = await supabase
            .from("lessons")
            .insert({
              module_id: modulo.id,
              curso_id: curso.id,
              titulo: aula.titulo,
              descricao: aula.descricao,
              conteudo: aula.conteudo,
              duracao_minutos: aula.duracao_minutos,
              ordem: j
            })

          if (aulaError) throw aulaError
        }
      }

      alert("Curso salvo com sucesso! Ele está inativo para revisão.")
      setGeneratedCourse(null)
      setPrompt("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar curso")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground mb-2 flex items-center gap-3">
          <Sparkles className="text-cyan" size={28} />
          AI Course Generator
        </h1>
        <p className="text-muted-foreground text-sm">
          Gere cursos completos com inteligência artificial em segundos
        </p>
      </div>

      {/* Formulário */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-8">
        <div className="space-y-6">
          {/* Prompt */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Descreva o curso que deseja criar
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Curso completo de eletrocardiograma para enfermeiros, focando em identificação de arritmias e emergências cardíacas..."
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all resize-none"
            />
          </div>

          {/* Configurações */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Nível
              </label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value as "iniciante" | "intermediario" | "avancado")}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-all"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Número de Módulos
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={numModulos}
                onChange={(e) => setNumModulos(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Aulas por Módulo
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={numAulas}
                onChange={(e) => setNumAulas(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-all"
              />
            </div>
          </div>

          {/* Botão */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-6 py-3 rounded-xl hover:bg-cyan/90 transition-all disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Gerando curso...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Gerar com IA
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Resultado */}
      {generatedCourse && (
        <div className="space-y-6">
          {/* Preview do curso */}
          <div className="rounded-2xl border border-cyan/30 bg-card p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold text-cyan uppercase tracking-wider">
                  {generatedCourse.tag} • {generatedCourse.nivel}
                </span>
                <h2 className="text-xl font-black text-foreground mt-1">{generatedCourse.titulo}</h2>
                <p className="text-muted-foreground text-sm mt-2">{generatedCourse.subtitulo}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setGeneratedCourse(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  <Trash2 size={14} />
                  Descartar
                </button>
                <button
                  onClick={handleSaveCourse}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-green-600 transition-all disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Salvar Curso
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Aprendizados */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-foreground mb-3">O que o aluno vai aprender:</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {generatedCourse.aprendizados.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-cyan mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Módulos */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Estrutura do curso:</h3>
              <div className="space-y-3">
                {generatedCourse.modulos.map((modulo, i) => (
                  <details key={i} className="rounded-xl border border-border bg-surface overflow-hidden">
                    <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-background/50 transition-colors">
                      <span className="w-6 h-6 rounded-full bg-cyan/10 text-cyan text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground flex-1">{modulo.titulo}</span>
                      <span className="text-xs text-muted-foreground">{modulo.aulas.length} aulas</span>
                    </summary>
                    <div className="border-t border-border p-4 space-y-2">
                      {modulo.aulas.map((aula, j) => (
                        <div key={j} className="flex items-center gap-3 text-sm">
                          <BookOpen size={12} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{aula.titulo}</span>
                          <span className="text-xs text-muted-foreground/60 ml-auto">
                            {aula.duracao_minutos}min
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Copy de vendas */}
          {generatedCourse.copy_vendas && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Copy de vendas gerada:</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Headline</span>
                  <p className="text-foreground font-semibold">{generatedCourse.copy_vendas.headline}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Subheadline</span>
                  <p className="text-muted-foreground">{generatedCourse.copy_vendas.subheadline}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Benefícios</span>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {generatedCourse.copy_vendas.beneficios.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
