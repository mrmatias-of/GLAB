'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Falha ao processar solicitação')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
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
            <h1 className="text-3xl font-bold text-white mb-2">Redefinir Senha</h1>
            <p className="text-slate-300 text-sm">Informe seu email para receber um link de recuperação</p>
          </div>

          {success ? (
            <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6 text-center space-y-3">
              <p className="text-green-200 font-semibold text-lg">✓ Email enviado com sucesso!</p>
              <p className="text-green-300/70 text-sm">
                Verifique sua caixa de entrada (ou spam) para o link de recuperação de senha.
              </p>
              <p className="text-green-300/70 text-xs">
                O link expira em 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email Cadastrado
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-red-200 text-sm">
                  <p className="font-medium">Erro</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
              >
                {loading ? '⏳ Enviando...' : '→ Enviar Link de Recuperação'}
              </button>

              <p className="text-center text-sm text-slate-400 mt-4">
                Lembre-se: o link de recuperação expira em 24 horas.
              </p>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-300 border-t border-white/10 pt-6 space-y-3">
            <p>
              Lembrou sua senha?{' '}
              <Link href="/login" className="text-blue-300 hover:text-blue-200 font-medium transition">
                Fazer login
              </Link>
            </p>
            <Link href="/" className="block text-slate-400 hover:text-slate-300 transition">
              ← Voltar para home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
