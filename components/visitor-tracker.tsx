"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"

export function VisitorTracker() {
  const pathname = usePathname()
  const { analyticsAllowed, loaded } = usePrivacyConsent()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Só executa após o estado de consentimento ser lido do localStorage
    if (!loaded) return
    // Só rastreia se o visitante permitiu métricas
    if (!analyticsAllowed) return
    // Evita rastrear a mesma página duas vezes seguidas
    if (lastTrackedPath.current === pathname) return

    lastTrackedPath.current = pathname

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || "",
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Falhas silenciosas — não interromper a experiência do usuário
    })
  }, [pathname, analyticsAllowed, loaded])

  return null
}
