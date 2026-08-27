'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

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
      setError(error.message ?? 'Something went wrong')
      return
    }

    if (isSignUp) {
      setVerificationSent(true)
      return
    }

    const entry = await fetch('/api/auth/entry')
      .then((response) => response.json() as Promise<{ href?: string }>)
      .catch(() => ({ href: '/aluno' }))

    router.push(entry.href ?? '/aluno')
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isSignUp ? 'Crie sua conta' : 'Acesso único G‑LAB'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp
              ? 'Seu acesso à plataforma técnica começa aqui.'
              : 'Alunos e admins entram pela mesma tela. As permissões definem automaticamente o painel liberado.'}
          </p>
        </div>

        {verificationSent ? <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-5 text-sm leading-6 text-cyan-950 dark:text-cyan-100"><strong className="block text-base">Confirme seu e-mail.</strong>Enviamos um link de ativação para <strong>{email}</strong>. Verifique também a caixa de spam. Após confirmar, entre normalmente na sua conta.</div> : <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Aguarde...'
              : isSignUp
                ? 'Criar conta e enviar confirmação'
                : 'Entrar na plataforma'}
          </Button>
        </form>}

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isSignUp ? 'Já tem uma conta? ' : 'Ainda não possui conta? '}
          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            {isSignUp ? 'Entrar' : 'Criar conta'}
          </Link>
        </p>
        {!isSignUp && <p className="mt-4 text-center text-sm"><Link href="/esqueci-a-senha" className="text-muted-foreground underline-offset-4 hover:underline">Esqueci minha senha</Link></p>}
      </Card>
    </main>
  )
}
