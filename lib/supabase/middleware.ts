import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas de admin — apenas usuários com is_admin = true
const adminRoutes = ['/admin']

// Rotas de aluno — apenas usuários autenticados sem role admin
const studentRoutes = ['/aluno']

// Rotas de auth — usuários logados são redirecionados
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

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  return NextResponse.redirect(url)
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  addSecurityHeaders(response)

  const isAdminRoute   = adminRoutes.some(r => pathname.startsWith(r))
  const isStudentRoute = studentRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute    = authRoutes.some(r => pathname.startsWith(r))
  const isPrivateRoute = isAdminRoute || isStudentRoute

  // Rotas públicas — nenhuma verificação necessária
  if (!isPrivateRoute && !isAuthRoute) return response

  // Verifica sessão
  const supabase = createSupabaseClient(request, response)
  const { data: { user } } = await supabase.auth.getUser()

  // Sem sessão tentando acessar área privada → login
  if (isPrivateRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (user) {
    const isAdmin = user.user_metadata?.is_admin === true

    // Aluno tentando acessar /admin → redireciona para /aluno (sem acesso)
    if (isAdminRoute && !isAdmin) {
      return redirect(request, '/aluno')
    }

    // Admin tentando acessar /aluno → redireciona para /admin
    if (isStudentRoute && isAdmin) {
      return redirect(request, '/admin')
    }

    // Usuário logado acessando /login → redireciona para a área certa
    if (isAuthRoute) {
      const next = request.nextUrl.searchParams.get('next') ?? ''
      const isValidNext = [...adminRoutes, ...studentRoutes].some(r => next.startsWith(r))
      // Só honra o ?next= se o usuário tiver permissão para aquela rota
      const safeNext = isValidNext && (isAdmin ? adminRoutes : studentRoutes).some(r => next.startsWith(r))
        ? next
        : isAdmin ? '/admin' : '/aluno'
      return redirect(request, safeNext)
    }
  }

  return response
}
