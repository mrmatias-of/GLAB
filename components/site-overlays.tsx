"use client"

import { usePathname } from "next/navigation"
import WhatsAppButton from "@/components/whatsapp-button"

/**
 * Renderiza apenas o canal real de atendimento em todas as rotas públicas.
 *
 * O PrivacyConsentBanner é mantido fora deste componente (diretamente no layout)
 * para garantir que o consentimento de privacidade funcione em todas as rotas.
 */
const LANDING_PATHS_WITHOUT_OVERLAYS = ["/cursos/combo-iniciante-mobile"]

export function SiteOverlays() {
  const pathname = usePathname()

  // Remover overlays de landing pages específicas e do painel admin
  const isLandingPage = LANDING_PATHS_WITHOUT_OVERLAYS.includes(pathname)
  const isAdminPanel = pathname.startsWith("/admin") || pathname.startsWith("/login")

  if (isLandingPage || isAdminPanel) {
    return null
  }

  return (
    <>
      <WhatsAppButton />
    </>
  )
}
