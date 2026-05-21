import { notifyError } from '@/lib/telegram'

export function setupErrorHandler() {
  // Capturar erros não capturados no Node.js
  process.on('uncaughtException', (error) => {
    console.error('[v0] Uncaught Exception:', error)
    notifyError(
      'Uncaught Exception',
      error.message || 'Erro desconhecido',
      error.stack
    )
  })

  // Capturar promessas rejeitadas
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[v0] Unhandled Rejection:', reason)
    const errorMessage = reason instanceof Error ? reason.message : String(reason)
    const errorStack = reason instanceof Error ? reason.stack : undefined
    notifyError(
      'Unhandled Promise Rejection',
      errorMessage,
      errorStack
    )
  })
}
