'use client'

import { PrivacyConsentBanner } from '@/components/privacy-consent-banner'

/**
 * Wrapper client-side para garantir que o banner de privacidade
 * seja renderizado apenas no cliente após a hidratação.
 * Isso evita problemas de localStorage e hydration mismatch.
 */
export function PrivacyBannerWrapper() {
  return <PrivacyConsentBanner />
}
