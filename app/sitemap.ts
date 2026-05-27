import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://www.glabcursos.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rotas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/cursos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Rotas dinâmicas — landing pages dos produtos ativos
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data } = await supabase
      .from('cursos')
      .select('slug, updated_at')
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    const productRoutes: MetadataRoute.Sitemap = (data ?? []).map((curso) => ({
      url: `${SITE_URL}/cursos/${curso.slug}`,
      lastModified: curso.updated_at ? new Date(curso.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...productRoutes]
  } catch {
    // Em caso de erro na query, retorna apenas as rotas estáticas
    return staticRoutes
  }
}
