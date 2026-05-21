"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 60000

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const router = useRouter()

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
      setError(`Muitas tentativas. Aguarde ${remaining}s.`)
      return
    }

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_TIME)
        setError("Muitas tentativas. Aguarde 1 minuto.")
        setAttempts(0)
      } else {
        setError("Email ou senha incorretos. Tente novamente.")
      }
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }, [email, password, attempts, lockedUntil, router])

  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-16" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="w-full max-w-md">

        {/* Logo/Título */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-white font-extrabold tracking-widest uppercase text-lg mb-2">
            G<span style={{ color: '#818cf8' }}>•</span>LAB
          </Link>
          <p className="text-sm" style={{ color: '#71717a' }}>Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#111113', border: '1px solid #27272a' }}>
          <h1 className="text-xl font-black text-white mb-1">Entrar</h1>
          <p className="text-sm mb-7" style={{ color: '#71717a' }}>Acesso restrito ao administrador</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#71717a' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                  style={{ backgroundColor: '#0B0B0C', border: '1px solid #27272a' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#71717a' }}>Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                  style={{ backgroundColor: '#0B0B0C', border: '1px solid #27272a' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: '#52525b' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar no Painel"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#3f3f46' }}>
          <Link href="/" className="hover:text-white transition-colors">Voltar ao site</Link>
        </p>
      </div>
    </main>
  )
}
