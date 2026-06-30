"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"

export function PrivacyConsentBanner() {
  const { loaded, choiceMade, allow, essentialOnly } = usePrivacyConsent()

  // Não renderiza até o estado do localStorage ser lido (evita flash)
  // Se choiceMade for true, o banner NÃO será mostrado (consentimento já dado)
  if (!loaded) return null
  if (choiceMade) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Painel de privacidade e métricas"
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 md:px-6"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="max-w-2xl mx-auto rounded-xl border p-5 shadow-2xl"
        style={{
          backgroundColor: "#0d0d1a",
          borderColor: "rgba(0,212,200,0.35)",
          pointerEvents: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(0,212,200,0.15)", border: "1px solid rgba(0,212,200,0.3)" }}
          >
            <Shield size={14} className="text-blue-400" />
          </div>
          <h2 className="text-sm font-bold text-white">Privacidade e métricas</h2>
        </div>

        {/* Texto */}
        <p className="text-xs leading-relaxed mb-4" style={{ color: "#a1a1aa" }}>
          Utilizamos dados de navegação para entender o uso do site e melhorar a experiência. Você
          pode permitir métricas opcionais ou continuar apenas com recursos essenciais. Consulte
          nossa{" "}
          <Link
            href="/privacidade"
            className="underline underline-offset-2 hover:text-blue-400 transition-colors"
            style={{ color: "#00D4C8" }}
          >
            Política de Privacidade
          </Link>
          .
        </p>

        {/* Ações */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={allow}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#00D4C8", color: "#050510" }}
          >
            Permitir métricas
          </button>
          <button
            onClick={essentialOnly}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "transparent",
              color: "#a1a1aa",
              border: "1px solid rgba(113,113,122,0.4)",
            }}
          >
            Somente essenciais
          </button>
        </div>
      </div>
    </div>
  )
}
