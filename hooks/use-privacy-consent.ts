"use client"

import { useEffect, useState } from "react"

export type PrivacyConsent = "analytics_allowed" | "essential_only" | null

const STORAGE_KEY = "glab_privacy_consent"

function readStoredConsent(): PrivacyConsent {
  // Chamada só chega aqui no cliente — typeof window é sempre definido
  // quando esta função é usada como inicializador do useState.
  try {
    return (localStorage.getItem(STORAGE_KEY) as PrivacyConsent | null) ?? null
  } catch {
    return null
  }
}

export function usePrivacyConsent() {
  // Inicializador lazy: executa uma única vez no cliente, de forma síncrona,
  // antes do primeiro render. Isso evita o flash do banner em usuários que
  // já fizeram a escolha, pois o estado já começa com o valor correto.
  const [consent, setConsent] = useState<PrivacyConsent>(() => {
    if (typeof window === "undefined") return null
    return readStoredConsent()
  })

  // loaded: true imediatamente no cliente (useState lazy já leu o valor),
  // false apenas durante SSR onde window não existe.
  const [loaded, setLoaded] = useState(() => typeof window !== "undefined")

  useEffect(() => {
    // Garante que loaded seja true no cliente mesmo em ambientes
    // onde o inicializador do useState não executou (ex: StrictMode duplo).
    setLoaded(true)
  }, [])

  const allow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "analytics_allowed")
    } catch {}
    setConsent("analytics_allowed")
  }

  const essentialOnly = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "essential_only")
    } catch {}
    setConsent("essential_only")
  }

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setConsent(null)
  }

  const analyticsAllowed = consent === "analytics_allowed"
  const choiceMade = consent !== null

  return { consent, loaded, choiceMade, analyticsAllowed, allow, essentialOnly, reset }
}
