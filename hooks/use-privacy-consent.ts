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
  // Inicializamos com null no servidor e no cliente para evitar hydration mismatch.
  // O valor real é lido no useEffect após a hidratação.
  const [consent, setConsent] = useState<PrivacyConsent>(null)

  // loaded começa como false para que servidor e cliente renderizem a mesma coisa.
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Lê o valor do localStorage apenas no cliente, após a hidratação.
    const storedConsent = readStoredConsent()
    setConsent(storedConsent)
    setLoaded(true)
  }, []) // Esta dependência vazia garante que roda apenas uma vez

  const allow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "analytics_allowed")
      // Confirmar que foi salvo com sucesso
      setConsent("analytics_allowed")
    } catch (error) {
      console.error("[v0] Failed to save analytics consent to localStorage:", error)
    }
  }

  const essentialOnly = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "essential_only")
      // Confirmar que foi salvo com sucesso
      setConsent("essential_only")
    } catch (error) {
      console.error("[v0] Failed to save essential-only consent to localStorage:", error)
    }
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
