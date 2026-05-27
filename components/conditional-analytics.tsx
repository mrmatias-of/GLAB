"use client"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"

/**
 * Monta Analytics e Speed Insights da Vercel somente quando o visitante
 * autorizou métricas. Se o consentimento ainda não foi dado ou foi negado,
 * os scripts não são carregados.
 *
 * Limitação: a Vercel Analytics não expõe uma API de opt-in/opt-out
 * nativa — a abordagem adotada é não montar o componente, o que impede
 * o envio de dados. Após o consentimento ser dado numa visita, a escolha
 * persiste via localStorage e os scripts passam a ser carregados normalmente.
 */
export function ConditionalAnalytics() {
  const { analyticsAllowed, loaded } = usePrivacyConsent()

  if (!loaded || !analyticsAllowed) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
