"use client"

import { useState, useEffect } from 'react'
import { X, ShoppingBag } from 'lucide-react'

// Nomes brasileiros comuns
const nomes = [
  'João', 'Pedro', 'Lucas', 'Matheus', 'Gabriel', 'Rafael', 'Bruno', 'Carlos',
  'Felipe', 'Thiago', 'André', 'Ricardo', 'Marcos', 'Paulo', 'Fernando',
  'Maria', 'Ana', 'Julia', 'Fernanda', 'Camila', 'Beatriz', 'Larissa',
  'Amanda', 'Letícia', 'Bruna', 'Carla', 'Patricia', 'Renata', 'Vanessa'
]

// Cidades brasileiras
const cidades = [
  'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA',
  'Brasília, DF', 'Curitiba, PR', 'Fortaleza, CE', 'Recife, PE', 'Porto Alegre, RS',
  'Manaus, AM', 'Goiânia, GO', 'Belém, PA', 'Campinas, SP', 'São Luís, MA',
  'Maceió, AL', 'Natal, RN', 'Campo Grande, MS', 'João Pessoa, PB', 'Teresina, PI',
  'Florianópolis, SC', 'Vitória, ES', 'Cuiabá, MT', 'Aracaju, SE', 'Londrina, PR',
  'Joinville, SC', 'Santos, SP', 'Uberlândia, MG', 'Ribeirão Preto, SP'
]

// Produtos (cursos)
const produtos = [
  { nome: 'Combo Iniciante Mobile', cor: '#818cf8' },
  { nome: 'Troca de Tela iPhone', cor: '#34d399' },
  { nome: 'Troca de Tela Android', cor: '#fbbf24' },
  { nome: 'Reparo de Bateria', cor: '#f87171' },
  { nome: 'Conector de Carga', cor: '#60a5fa' },
]

// Tempos aleatórios
const tempos = [
  'agora mesmo', 'há 1 minuto', 'há 2 minutos', 'há 3 minutos', 
  'há 5 minutos', 'há 8 minutos', 'há 10 minutos', 'há 15 minutos'
]

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function gerarNotificacao() {
  return {
    id: Date.now(),
    nome: getRandomItem(nomes),
    cidade: getRandomItem(cidades),
    produto: getRandomItem(produtos),
    tempo: getRandomItem(tempos),
  }
}

export function SocialProofPopup() {
  const [notificacao, setNotificacao] = useState<ReturnType<typeof gerarNotificacao> | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Não mostrar se usuário já fechou manualmente
    if (dismissed) return

    // Primeira notificação após 5-10 segundos
    const primeiroDelay = 5000 + Math.random() * 5000

    const timeout = setTimeout(() => {
      mostrarNotificacao()
    }, primeiroDelay)

    return () => clearTimeout(timeout)
  }, [dismissed])

  useEffect(() => {
    if (!isVisible || dismissed) return

    // Esconder após 5 segundos
    const hideTimeout = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    // Próxima notificação após 15-30 segundos
    const nextTimeout = setTimeout(() => {
      mostrarNotificacao()
    }, 15000 + Math.random() * 15000)

    return () => {
      clearTimeout(hideTimeout)
      clearTimeout(nextTimeout)
    }
  }, [isVisible, notificacao, dismissed])

  function mostrarNotificacao() {
    if (dismissed) return
    setNotificacao(gerarNotificacao())
    setIsVisible(true)
  }

  function fechar() {
    setIsVisible(false)
    setDismissed(true)
  }

  if (!notificacao || !isVisible) return null

  return (
    <div
      className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left-full duration-500"
      style={{ maxWidth: '320px' }}
    >
      <div
        className="relative rounded-xl border p-4 shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(15, 15, 17, 0.95)',
          borderColor: '#27272a',
        }}
      >
        {/* Botão fechar */}
        <button
          onClick={fechar}
          className="absolute top-2 right-2 p-1 rounded-full transition-colors"
          style={{ color: '#71717a' }}
          aria-label="Fechar"
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${notificacao.produto.cor}20` }}
          >
            <ShoppingBag size={18} style={{ color: notificacao.produto.cor }} />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-sm font-medium text-white leading-tight">
              <span style={{ color: notificacao.produto.cor }}>{notificacao.nome}</span>
              {' '}de {notificacao.cidade.split(',')[0]}
            </p>
            <p className="text-xs mt-1" style={{ color: '#a1a1aa' }}>
              comprou <span className="font-medium text-white">{notificacao.produto.nome}</span>
            </p>
            <p className="text-[10px] mt-1.5" style={{ color: '#71717a' }}>
              {notificacao.tempo}
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 rounded-b-xl animate-shrink"
          style={{ 
            backgroundColor: notificacao.produto.cor,
            width: '100%',
          }}
        />
      </div>
    </div>
  )
}
