'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface AuthFormProps {
  isLogin: boolean
}

export default function AuthForm({ isLogin }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError(signInError.message)
          setLoading(false)
          return
        }

        setSuccess('Login realizado com sucesso!')
        setTimeout(() => router.push('/cursos'), 1000)
      } else {
        // Signup
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message)
          setLoading(false)
          return
        }

        setSuccess('Conta criada! Verifique seu email para confirmar.')
        setEmail('')
        setPassword('')
        setName('')
      }
    } catch (err: any) {
      setError('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name (signup only) */}
      {!isLogin && (
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-white mb-2">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required={!isLogin}
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      )}

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
          placeholder="seu@email.com"
          required
          className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
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
          minLength={6}
          className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-950 border border-red-900 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-3 rounded-lg bg-green-950 border border-green-900 text-sm text-green-200">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: loading
            ? 'rgba(99, 102, 241, 0.5)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isLogin ? 'Conectando...' : 'Criando conta...'}
          </>
        ) : isLogin ? (
          'Entrar'
        ) : (
          'Criar conta'
        )}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px" style={{ background: '#27272a' }}></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-background" style={{ color: '#71717a' }}>
            ou continue com
          </span>
        </div>
      </div>

      {/* Google Button */}
      <button
        type="button"
        disabled
        className="w-full py-2.5 rounded-lg font-medium text-white border border-zinc-800 transition-colors disabled:opacity-50"
        style={{ color: '#a1a1aa' }}
      >
        Google (em breve)
      </button>
    </form>
  )
}
