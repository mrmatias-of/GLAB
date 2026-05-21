"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()
  const tracked = useRef(false)

  useEffect(() => {
    // Evitar tracking duplicado na mesma sessao
    if (tracked.current) return
    
    // Evitar tracking de bots e prerender
    if (typeof window === "undefined") return
    if (navigator.userAgent.includes("bot") || navigator.userAgent.includes("Bot")) return

    const track = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
          }),
        })
        tracked.current = true
      } catch {
        // Silently fail
      }
    }

    // Pequeno delay para nao impactar carregamento
    const timeout = setTimeout(track, 1000)
    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}
