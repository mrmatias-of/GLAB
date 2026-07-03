'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Inicializando serviços...',
  'Conectando banco de dados...',
  'Carregando módulos...',
  'Verificando segurança...',
  'Aplicando configurações...',
  'Carregando interface...',
  'Sincronizando permissões...',
  'Otimizando desempenho...',
  'Preparando ambiente...',
  'Sistema quase pronto...',
]

interface LoadingMessagesProps {
  currentIndex: number
}

export function LoadingMessages({ currentIndex }: LoadingMessagesProps) {
  const [visible, setVisible] = useState(true)
  const [displayed, setDisplayed] = useState(MESSAGES[0])

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => {
      setDisplayed(MESSAGES[Math.min(currentIndex, MESSAGES.length - 1)])
      setVisible(true)
    }, 220)
    return () => clearTimeout(t)
  }, [currentIndex])

  return (
    <p
      style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        minHeight: '16px',
        textAlign: 'center',
      }}
      aria-live="polite"
    >
      {displayed}
    </p>
  )
}
