"use client"

import { usePathname } from "next/navigation"
import { SocialProofPopup } from "@/components/social-proof-popup"
import WhatsAppButton from "@/components/whatsapp-button"

/**
 * Renderiza os overlays promocionais globais (popup de prova social e botão
 * do WhatsApp) em todas as rotas, exceto nas landing pages dedicadas onde esses
 * elementos são distratores indesejados.
 *
 * O PrivacyConsentBanner é mantido fora deste componente (diretamente no layout)
 * para garantir que o consentimento de privacidade funcione em todas as rotas.
 */
const LANDING_PATHS_WITHOUT_OVERLAYS = ["/cursos/combo-iniciante-mobile"]

export function SiteOverlays() {
  const pathname = usePathname()

  if (LANDING_PATHS_WITHOUT_OVERLAYS.includes(pathname)) {
    return null
  }

  return (
    <>
      <SocialProofPopup />
      <WhatsAppButton />
    </>
  )
}
