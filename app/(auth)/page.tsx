'use client'

import { useState } from 'react'
import Image from 'next/image'
import AuthForm from '@/components/auth-form'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-glab-neon-transparent.png"
              alt="G-LAB Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-white font-extrabold tracking-widest text-xs">G•LAB</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {isLogin ? 'Bem-vindo' : 'Comece agora'}
            </h1>
            <p className="text-sm" style={{ color: '#71717a' }}>
              {isLogin
                ? 'Acesse sua conta para continuar com os cursos'
                : 'Crie uma conta para acessar todos os cursos'}
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm isLogin={isLogin} />

          {/* Toggle */}
          <div className="mt-6 text-center text-sm" style={{ color: '#71717a' }}>
            {isLogin ? (
              <>
                Não tem conta?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium transition-colors"
                  style={{ color: '#818cf8' }}
                >
                  Crie uma
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium transition-colors"
                  style={{ color: '#818cf8' }}
                >
                  Faça login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Hero */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-8"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
      >
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-extrabold text-white mb-4">G•LAB Cursos</h2>
          <p className="text-lg" style={{ color: '#a1a1aa' }}>
            Aprenda com profissionais que já repararam mais de 20 mil aparelhos
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full mt-2" style={{ background: '#818cf8' }}></div>
              <p className="text-sm text-left" style={{ color: '#a1a1aa' }}>
                Cursos práticos e direto ao ponto
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full mt-2" style={{ background: '#818cf8' }}></div>
              <p className="text-sm text-left" style={{ color: '#a1a1aa' }}>
                +10 anos de experiência em manutenção
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full mt-2" style={{ background: '#818cf8' }}></div>
              <p className="text-sm text-left" style={{ color: '#a1a1aa' }}>
                Acesso vitalício aos conteúdos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
