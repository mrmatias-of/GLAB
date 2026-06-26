'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos
const WARNING_TIME = 25 * 60 * 1000 // Avisar 5 minutos antes

export function useActivityTracker() {
  const router = useRouter()

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    let warningTimer: NodeJS.Timeout
    let hasShownWarning = false

    const updateActivity = async () => {
      try {
        // Atualizar timestamp no servidor via API
        await fetch('/api/auth/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        hasShownWarning = false
      } catch (err) {
        console.error('[Activity] Erro ao atualizar atividade:', err)
      }
    }

    const showWarning = () => {
      if (!hasShownWarning) {
        hasShownWarning = true
        alert('Sua sessão vai expirar em 5 minutos por inatividade. Clique em OK para continuar.')
      }
    }

    const logout = () => {
      try {
        document.cookie = 'auth_session=; path=/; max-age=0'
        document.cookie = 'last_activity=; path=/; max-age=0'
      } catch (err) {
        console.error('[Activity] Erro ao limpar cookies:', err)
      }
      router.push('/login')
    }

    const resetTimers = () => {
      clearTimeout(inactivityTimer)
      clearTimeout(warningTimer)

      // Avisar 5 minutos antes da expiração
      warningTimer = setTimeout(showWarning, WARNING_TIME)

      // Fazer logout após timeout total
      inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT)

      // Atualizar atividade no servidor
      updateActivity()
    }

    // Eventos que indicam atividade do usuário
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    events.forEach(event => {
      document.addEventListener(event, resetTimers)
    })

    // Inicializar timers
    resetTimers()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimers)
      })
      clearTimeout(inactivityTimer)
      clearTimeout(warningTimer)
    }
  }, [router])
}
