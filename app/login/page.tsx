'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signIn } from '@/lib/auth-client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: '/admin/dashboard',
        fetchOptions: {
          onSuccess: () => {
            setSuccess(true)
            setTimeout(() => router.push('/admin/dashboard'), 800)
          },
          onError: (ctx) => {
            setError(ctx.error?.message || 'Email ou senha incorretos')
          },
        },
      })

      if (result?.error) {
        setError(result.error.message || 'Email ou senha incorretos')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle-at-20%-50%,rgba(6,182,212,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle-at-80%-80%,rgba(59,130,246,0.3),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="G•Lab Cursos"
                width={160}
                height={160}
                className="drop-shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">G•Lab Cursos</h1>
            <p className="text-slate-300 text-sm">Plataforma de Educação Online</p>
          </div>

          {success ? (
            <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 text-center">
              <p className="text-green-200 font-semibold">✓ Login realizado com sucesso!</p>
              <p className="text-green-300/70 text-sm mt-2">Redirecionando para o painel...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-red-200 text-sm">
                  <p className="font-medium">Erro ao fazer login</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
              >
                {loading ? '⏳ Entrando...' : '→ Entrar no Painel'}
              </button>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <a
                  href="/auth/signup"
                  className="px-4 py-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded-lg hover:bg-green-500/30 transition text-center text-sm font-medium"
                >
                  + Criar Conta
                </a>
                <a
                  href="/auth/forgot-password"
                  className="px-4 py-2 bg-amber-500/20 border border-amber-400/50 text-amber-300 rounded-lg hover:bg-amber-500/30 transition text-center text-sm font-medium"
                >
                  🔑 Redefinir Senha
                </a>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-300 border-t border-white/10 pt-6">
            <a href="/" className="text-blue-300 hover:text-blue-200 font-medium transition">
              ← Voltar para home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
