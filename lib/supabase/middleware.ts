import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas privadas — exigem autenticação
const privateRoutes = ['/admin', '/aluno']

// Rotas de auth — usuários logados não devem acessar
const authRoutes = ['/login']

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

function createSupabaseClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // Sempre aplica headers de segurança
  addSecurityHeaders(response)

  const isPrivateRoute = privateRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  // Rotas públicas — não precisa verificar autenticação
  if (!isPrivateRoute && !isAuthRoute) {
    return response
  }

  // Verifica sessão apenas para rotas privadas ou de auth
  const supabase = createSupabaseClient(request, response)
  const { data: { user } } = await supabase.auth.getUser()

  // Rota privada sem sessão → redireciona para login
  if (isPrivateRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Página de login com sessão ativa → redireciona para área correta
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    const next = request.nextUrl.searchParams.get('next')
    // Redireciona para o 'next' se for uma rota válida, senão vai para /aluno
    url.pathname = next && privateRoutes.some(r => next.startsWith(r)) ? next : '/aluno'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}
