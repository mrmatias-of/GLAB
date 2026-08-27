'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Algo deu errado. Tente novamente.')
      return
    }

    router.push('/aluno')
    router.refresh()
  }

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#040610] px-4 py-12 text-white">
      {/* Atmosfera de fundo, consistente com a home */}
      <div className="premium-grid absolute inset-0 opacity-40" />
      <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-blue-600/[.14] blur-[160px]" />
      <div className="absolute -right-32 bottom-0 h-[560px] w-[560px] rounded-full bg-violet-600/[.13] blur-[180px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="relative z-10 flex w-full items-center justify-center">
        <section className="w-full max-w-md rounded-[28px] border border-white/[.12] bg-[#080b16]/90 p-8 shadow-[0_45px_120px_rgba(0,0,0,.55)] backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Segurança G‑LAB</p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
            {isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {isSignUp
              ? 'Seu acesso à formação técnica começa aqui.'
              : 'Entre para acessar sua biblioteca G·LAB.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            {isSignUp && (
              <label className="block text-sm font-bold text-white/90">
                Nome
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-300"
                />
              </label>
            )}

            <label className="block text-sm font-bold text-white/90">
              E-mail
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="voce@exemplo.com"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-300"
              />
            </label>

            <label className="block text-sm font-bold text-white/90">
              Senha
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-300"
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-sm leading-5 text-red-200"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-3 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={15} />
              {loading
                ? 'Aguarde...'
                : isSignUp
                  ? 'Criar conta'
                  : 'Entrar na plataforma'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isSignUp ? 'Já tem uma conta? ' : 'Ainda não possui conta? '}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="font-bold text-cyan-300 underline-offset-4 hover:text-cyan-200 hover:underline"
            >
              {isSignUp ? 'Entrar' : 'Criar conta'}
            </Link>
          </p>

          {!isSignUp && (
            <p className="mt-3 text-center text-sm">
              <Link
                href="/esqueci-a-senha"
                className="text-slate-500 underline-offset-4 hover:text-cyan-300 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
