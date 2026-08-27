'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Wrench } from 'lucide-react'
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

  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(hsl(var(--border)/.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/.3)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/80 bg-card/95 shadow-2xl shadow-primary/10 lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden border-r border-border bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
          <Image src="/images/hero-microscope-lab-v2.png" alt="Bancada técnica de assistência mobile" fill className="object-cover opacity-20 mix-blend-screen" priority />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20"><Wrench /></div>
            <span className="text-sm font-black uppercase tracking-[.24em]">G·LAB Cursos</span>
          </div>
          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-xs font-black uppercase tracking-[.24em] text-primary-foreground/65">Conhecimento que vira bancada</p>
            <h2 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">Sua próxima reparação começa aqui.</h2>
            <p className="mt-6 text-base leading-7 text-primary-foreground/75">Guias práticos, diagnóstico e processos para você trabalhar com mais segurança e resultado.</p>
            <div className="mt-8 flex flex-col gap-3 text-sm text-primary-foreground/85">
              {['Aulas diretas ao ponto', 'Acesso aos seus cursos em um só lugar', 'Certificado ao concluir sua jornada'].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-primary-foreground/70" />{item}</div>)}
            </div>
          </div>
          <p className="relative z-10 text-xs text-primary-foreground/50">Aprenda. Repare. Evolua.</p>
        </section>

        <Card className="rounded-none border-0 bg-transparent p-6 shadow-none sm:p-10 lg:p-12 xl:p-14">
          <div className="mb-9 flex items-center gap-3 lg:hidden"><div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Wrench className="size-4" /></div><span className="text-xs font-black uppercase tracking-[.2em] text-foreground">G·LAB Cursos</span></div>
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-primary">{isSignUp ? 'Comece sua jornada' : 'Área do aluno'}</p>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">{isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{isSignUp ? 'Seu acesso à plataforma técnica começa aqui.' : 'Entre para continuar seus estudos e acessar seus cursos.'}</p>
          </div>

          {verificationSent ? <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5 text-sm leading-6 text-foreground"><strong className="mb-1 block text-base">Confirme seu e-mail.</strong>Enviamos um link de ativação para <strong>{email}</strong>. Verifique também a caixa de spam.</div> : <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignUp && <div className="flex flex-col gap-2"><Label htmlFor="name">Nome completo</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Como podemos chamar você?" className="h-12 rounded-xl bg-background/60 px-4" /></div>}
            <div className="flex flex-col gap-2"><Label htmlFor="email">E-mail</Label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="voce@exemplo.com" className="h-12 rounded-xl bg-background/60 pl-11" /></div></div>
            <div className="flex flex-col gap-2"><div className="flex items-center justify-between"><Label htmlFor="password">Senha</Label>{!isSignUp && <Link href="/esqueci-a-senha" className="text-xs font-medium text-primary hover:underline">Esqueci a senha</Link>}</div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={isSignUp ? 'new-password' : 'current-password'} placeholder="Mínimo de 8 caracteres" className="h-12 rounded-xl bg-background/60 pl-11 pr-11" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
            {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl text-sm font-bold">{loading ? 'Aguarde...' : isSignUp ? <><span>Criar conta e continuar</span><ArrowRight /></> : <><span>Entrar na plataforma</span><ArrowRight /></>}</Button>
          </form>}
          <p className="mt-8 text-center text-sm text-muted-foreground">{isSignUp ? 'Já tem uma conta? ' : 'Ainda não possui conta? '}<Link href={isSignUp ? '/sign-in' : '/sign-up'} className="font-bold text-primary hover:underline">{isSignUp ? 'Entrar' : 'Criar conta'}</Link></p>
        </Card>
      </div>
    </main>
  )
}
