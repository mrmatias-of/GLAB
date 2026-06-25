import { Smartphone, Monitor, Apple, Layers, type LucideIcon } from "lucide-react"
import { prisma } from "@/lib/db"

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
    const result = await pool.query(
      'SELECT * FROM cursos ORDER BY posicao'
    )
    
    if (!result.rows || result.rows.length === 0) {
      console.warn("[v0] Nenhum curso encontrado no banco de dados")
      return []
    }

    cursosCache = result.rows.map((curso: any) => ({
      slug: curso.slug,
      tag: curso.tag || "Geral",
      titulo: curso.titulo,
      subtitulo: curso.subtitulo || "",
      descricao: curso.descricao || "",
      descricaoLonga: curso.descricao || "",
      imagem: curso.imagem || undefined,
      icon: getIconByTag(curso.tag || "Geral"),
      destaque: curso.destaque || false,
      preco: curso.preco,
      precoOriginal: curso.preco_original || undefined,
      modulos: Array.isArray(curso.modulos) ? curso.modulos : [],
      aprendizados: [],
      cta: curso.cta || "Comprar Agora",
      ctaHref: curso.cta_href || "",
      accentColor: "#2563eb",
      nivel: undefined,
      categoria: undefined,
      headline: undefined,
      headlineSub: undefined,
      paraQuem: undefined,
      dores: undefined,
      ctaHeadline: undefined,
      ctaHeadlineSub: undefined,
      trilha: undefined,
      relacionados: undefined,
    }))

    cursoCacheTime = now
    return cursosCache
  } catch (err) {
    console.error("[v0] Erro ao conectar ao Neon:", err)
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
    const result = await pool.query('SELECT slug FROM cursos')
    
    if (!result.rows || result.rows.length === 0) {
      console.warn("[v0] Nenhum slug encontrado no banco de dados")
      return []
    }
    
    return result.rows.map((c: { slug: string }) => c.slug)
  } catch (err) {
    console.error("[v0] Erro ao conectar ao Neon para slugs:", err)
    return []
  }
}
