'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Falha ao fazer login')
      }

      setSuccess(true)
      setTimeout(() => router.push('/admin'), 1500)
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
                src="/logo-glab-neon.png"
                alt="G•Lab Cursos"
                width={80}
                height={80}
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
