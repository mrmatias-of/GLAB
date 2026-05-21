import { createClient } from "@/lib/supabase/server"
import { Smartphone, Monitor, Apple, Layers, type LucideIcon } from "lucide-react"

export type Modulo = {
  titulo: string
  topicos: string[]
}

export type Curso = {
  slug: string
  tag: string
  titulo: string
  subtitulo?: string
  descricao: string
  descricaoLonga: string
  icon: LucideIcon
  destaque: boolean
  preco: string
  precoOriginal?: string
  modulos: Modulo[]
  aprendizados: string[]
  cta: string
  ctaHref: string
  accentColor: string
}

const getIconByTag = (tag: string): LucideIcon => {
  if (tag.includes("iPhone")) return Apple
  if (tag.includes("Android")) return Smartphone
  if (tag.includes("Windows")) return Monitor
  return Layers
}

// Cache de 1 hora
let cursosCache: Curso[] | null = null
let cursoCacheTime = 0

export async function getCursos(): Promise<Curso[]> {
  const now = Date.now()
  if (cursosCache && (now - cursoCacheTime) < 3600000) {
    return cursosCache
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("cursos")
      .select("slug, tag, titulo, subtitulo, descricao, descricao_longa, preco, preco_original, cta, cta_href, destaque, modulos, aprendizados, ordem")
      .eq("ativo", true)
      .order("ordem", { ascending: true })

    if (error || !data) {
      console.error("[v0] Erro ao buscar cursos:", error)
      return []
    }

    cursosCache = data.map((curso: any) => ({
      slug: curso.slug,
      tag: curso.tag,
      titulo: curso.titulo,
      subtitulo: curso.subtitulo || "",
      descricao: curso.descricao,
      descricaoLonga: curso.descricao_longa || curso.descricao,
      icon: getIconByTag(curso.tag),
      destaque: curso.destaque || false,
      preco: curso.preco,
      precoOriginal: curso.preco_original || undefined,
      modulos: curso.modulos || [],
      aprendizados: curso.aprendizados || [],
      cta: curso.cta || "Comprar Agora",
      ctaHref: curso.cta_href || "",
      accentColor: "#00d4c8",
    }))

    cursoCacheTime = now
    return cursosCache
  } catch (err) {
    console.error("[v0] Erro ao conectar ao Supabase:", err)
    return []
  }
}

export async function getCursoBySlug(slug: string): Promise<Curso | undefined> {
  const cursos = await getCursos()
  return cursos.find((c) => c.slug === slug)
}

// Fallback para geração estática
export async function getCursoSlugs(): Promise<string[]> {
  const cursos = await getCursos()
  return cursos.map((c) => c.slug)
}
