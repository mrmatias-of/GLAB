'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BackgroundGrid }    from './BackgroundGrid'
import { FloatingParticles } from './FloatingParticles'
import { AnimatedLogo }      from './AnimatedLogo'
import { LuminousLine }      from './LuminousLine'
import { ProgressBar }       from './ProgressBar'
import { LoadingTasks }      from './LoadingTasks'
import { LoadingMessages }   from './LoadingMessages'
import { useStartupController } from './useStartupController'

const MAINTENANCE_MODE = false

export function StartupScreen() {
  const router = useRouter()
  const { progress, taskIndex, msgIndex, finished } = useStartupController()

  // Redirect to /login after completion
  useEffect(() => {
    if (!finished) return
    const t = setTimeout(() => router.push('/login'), 800)
    return () => clearTimeout(t)
  }, [finished, router])

  // ── Maintenance mode ──────────────────────────────────────────────────────
  if (MAINTENANCE_MODE) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#09090B] flex flex-col items-center justify-center px-6">
        <BackgroundGrid />
        <FloatingParticles />
        <div className="flex flex-col items-center gap-10 text-center z-10">
          <AnimatedLogo />
          <div className="w-12 h-px bg-gray-200 dark:bg-white/10" />
          <div className="space-y-2 max-w-sm">
            <p className="text-gray-900 dark:text-white font-semibold text-lg">Sistema em manutenção.</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Estamos realizando melhorias. Voltamos em breve com novidades.
            </p>
          </div>
        </div>
        <p className="absolute bottom-8 text-xs text-gray-300 dark:text-gray-700">&copy; 2025 G-Lab</p>
      </main>
    )
  }

  // ── Startup screen ────────────────────────────────────────────────────────
  return (
    <main
      className="relative min-h-screen bg-white dark:bg-[#09090B] flex flex-col items-center justify-center overflow-hidden"
      style={{ transition: 'opacity 0.5s ease' }}
    >
      <BackgroundGrid />
      <FloatingParticles />

      <div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ gap: '32px' }}
      >
        {/* Logo */}
        <AnimatedLogo />

        {/* Name block */}
        <div className="flex flex-col items-center gap-1" style={{ animationDelay: '0.5s' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              letterSpacing: '0.08em',
              color: '#111827',
            }}
            className="dark:text-white"
          >
            G-Lab
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              color: '#6B7280',
            }}
          >
            Enterprise Repair Platform
          </span>
        </div>

        {/* Luminous line */}
        <LuminousLine />

        {/* Boot label */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
          }}
        >
          Inicializando Plataforma
        </p>

        {/* Tasks */}
        <LoadingTasks activeIndex={taskIndex} />

        {/* Progress bar */}
        <ProgressBar progress={progress} />

        {/* Message */}
        <LoadingMessages currentIndex={msgIndex} />
      </div>

      {/* Footer */}
      <p
        className="absolute bottom-8 text-xs text-gray-300 dark:text-gray-700 z-10"
        style={{ letterSpacing: '0.04em' }}
      >
        &copy; 2025 G-Lab
      </p>
    </main>
  )
}
