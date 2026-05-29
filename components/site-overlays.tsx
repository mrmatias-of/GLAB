'use client'

import { usePathname } from "next/navigation"
import WhatsAppButton from "@/components/whatsapp-button"
import { SocialProofPopup } from "@/components/social-proof-popup"
import { PrivacyConsentBanner } from "@/components/privacy-consent-banner"

const LANDING_PATHS = ["/cursos/combo-iniciante-mobile"]

export default function SiteOverlays() {
  const pathname = usePathname()
  const isFocusedLanding = LANDING_PATHS.includes(pathname)

  return (
    <>
      {!isFocusedLanding && <SocialProofPopup />}
      {!isFocusedLanding && <WhatsAppButton />}
      <PrivacyConsentBanner />
    </>
  )
}
