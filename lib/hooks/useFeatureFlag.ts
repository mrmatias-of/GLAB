'use client'

import { useEffect, useState } from 'react'

/**
 * Hook para verificar se uma feature está ativada para o tenant
 * 
 * Usage:
 *   const { enabled, loading } = useFeatureFlag('rh_module')
 *   
 *   if (loading) return <div>Carregando...</div>
 *   if (!enabled) return <div>Módulo não disponível</div>
 *   
 *   return <RhModule />
 */
export function useFeatureFlag(featureKey: string) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkFeature() {
      try {
        setLoading(true)
        const response = await fetch('/api/tenant/features/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature_key: featureKey }),
        })

        if (!response.ok) {
          throw new Error('Failed to check feature')
        }

        const data = await response.json()
        setEnabled(data.enabled)
      } catch (err: any) {
        setError(err.message)
        setEnabled(false)
      } finally {
        setLoading(false)
      }
    }

    checkFeature()
  }, [featureKey])

  return { enabled, loading, error }
}

/**
 * Hook para cache de features (previne múltiplas requisições)
 */
const featureCache = new Map<string, { enabled: boolean; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useFeatureFlagCached(featureKey: string) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkFeature() {
      // Verificar cache
      const cached = featureCache.get(featureKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setEnabled(cached.enabled)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/tenant/features/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature_key: featureKey }),
        })

        if (response.ok) {
          const data = await response.json()
          setEnabled(data.enabled)
          // Guardar no cache
          featureCache.set(featureKey, {
            enabled: data.enabled,
            timestamp: Date.now(),
          })
        }
      } finally {
        setLoading(false)
      }
    }

    checkFeature()
  }, [featureKey])

  return { enabled, loading }
}

/**
 * Componente wrapper para features
 */
export function FeatureGuard({
  feature,
  children,
  fallback = null,
}: {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { enabled, loading } = useFeatureFlagCached(feature)

  if (loading) return <div>Carregando...</div>
  if (!enabled) return <>{fallback}</>

  return <>{children}</>
}
