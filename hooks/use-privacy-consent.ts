"use client"

import { useEffect, useState } from "react"

export type PrivacyConsent = "analytics_allowed" | "essential_only" | null

const STORAGE_KEY = "glab_privacy_consent"

export function usePrivacyConsent() {
  const [consent, setConsent] = useState<PrivacyConsent>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as PrivacyConsent | null
      setConsent(stored)
    } catch {
      // localStorage indisponível (SSR ou modo privado restrito)
    } finally {
      setLoaded(true)
    }
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
