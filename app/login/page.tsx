'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[v0] Tentando login com:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('[v0] Resposta da API:', { status: response.status, hasToken: !!data.token })

      if (!response.ok) {
        console.log('[v0] Erro de autenticação:', data.error)
        
        // Mensagens de erro específicas
        if (response.status === 401) {
          setError('Email ou senha incorretos. Verifique suas credenciais.')
        } else if (data.error?.toLowerCase().includes('not found')) {
          setError('Usuário não encontrado. Verifique o email.')
        } else if (data.error?.toLowerCase().includes('password')) {
          setError('Senha incorreta. Tente novamente.')
        } else {
          setError(data.error || 'Erro ao fazer login. Tente novamente.')
        }
        
        setLoading(false)
        return
      }

      // Token foi salvo em cookie pelo servidor
      // Obter dados do usuário
      const meResponse = await fetch('/api/auth/me')
      const user = await meResponse.json()

      console.log('[v0] Dados do usuário:', { email: user.email, isAdmin: user.is_admin, isVendedor: user.is_vendedor })

      // Redirecionar baseado no role do usuário
      if (user.is_admin) {
        console.log('[v0] Redirecionando para /admin')
        router.push('/admin')
      } else if (user.is_vendedor) {
        console.log('[v0] Redirecionando para /admin/suporte')
        router.push('/admin/suporte')
      } else {
        console.log('[v0] Redirecionando para /suporte/meus-tickets')
        router.push('/suporte/meus-tickets')
      }

      router.refresh()
    } catch (err) {
      console.error('[v0] Erro:', err)
      setError('Erro ao fazer login. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/logo-glab-neon-transparent.png"
                alt="G-LAB Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Painel Admin</h1>
            <p className="text-sm" style={{ color: '#71717a' }}>
              Acesso restrito a administradores
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@glabcursos.com.br"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-900/50 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Hero */}
      <div 
        className="hidden lg:flex flex-1 items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        }}
      >
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div 
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Area Restrita
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Este painel e exclusivo para administradores do G-LAB. 
            Gerencie cursos, usuarios e configuracoes do sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
// Cache bust: 1782417999 - Force new build without Supabase
