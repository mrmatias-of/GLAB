import { createClient, createAnonClient } from "@/lib/supabase/server"
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
  imagem?: string
  icon: LucideIcon
  destaque: boolean
  preco: string
  precoOriginal?: string
  modulos: Modulo[]
  aprendizados: string[]
  cta: string
  ctaHref: string
  accentColor: string
  // Campos de landing page
  categoria?: string
  headline?: string
  headlineSub?: string
  nivel?: string
  paraQuem?: string[]
  dores?: string[]
  ctaHeadline?: string
  ctaHeadlineSub?: string
  trilha?: string
  relacionados?: string[]
}

// Versão sem `icon` para uso em Client Components (evita erro de serialização)
export type CursoSerializavel = Omit<Curso, "icon">

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
      .select("slug, tag, titulo, subtitulo, descricao, descricao_longa, imagem, preco, preco_original, cta, cta_href, destaque, modulos, aprendizados, ordem, nivel, categoria, headline, headline_sub, para_quem, dores, cta_headline, cta_headline_sub, trilha, relacionados")
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
      imagem: curso.imagem || undefined,
      icon: getIconByTag(curso.tag),
      destaque: curso.destaque || false,
      preco: curso.preco,
      precoOriginal: curso.preco_original || undefined,
      modulos: curso.modulos || [],
      aprendizados: curso.aprendizados || [],
      cta: curso.cta || "Comprar Agora",
      ctaHref: curso.cta_href || "",
      accentColor: "#00d4c8",
      nivel: curso.nivel || undefined,
      categoria: curso.categoria || undefined,
      headline: curso.headline || undefined,
      headlineSub: curso.headline_sub || undefined,
      paraQuem: curso.para_quem || undefined,
      dores: curso.dores || undefined,
      ctaHeadline: curso.cta_headline || undefined,
      ctaHeadlineSub: curso.cta_headline_sub || undefined,
      trilha: curso.trilha || undefined,
      relacionados: curso.relacionados || undefined,
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

// Função para geração estática (sem cookies)
export async function getCursoSlugs(): Promise<string[]> {
  try {
    const supabase = createAnonClient()
    const { data, error } = await supabase
      .from("cursos")
      .select("slug")
      .eq("ativo", true)
    
    if (error || !data) {
      console.error("[v0] Erro ao buscar slugs:", error)
      return []
    }
    
    return data.map((c: { slug: string }) => c.slug)
  } catch (err) {
    console.error("[v0] Erro ao conectar ao Supabase para slugs:", err)
    return []
  }
}
