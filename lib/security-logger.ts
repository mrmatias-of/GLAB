/**
 * Security Event Logger
 * 
 * Registra todos os eventos de segurança (login, logout, falhas, etc)
 * Em produção, estes logs devem ser enviados para um serviço centralizado
 * como Sentry, DataDog, ou AWS CloudWatch
 */

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'login_rate_limit'
  | 'logout'
  | 'session_expired'
  | 'unauthorized_access'
  | 'api_error'
  | 'password_change'
  | 'password_reset_request'
  | 'suspicious_activity'

export interface SecurityEvent {
  timestamp: string
  eventType: SecurityEventType
  email: string
  ipAddress: string
  userAgent?: string
  details?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class SecurityLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log de evento de segurança
   */
  logEvent(event: SecurityEvent): void {
    const logMessage = this.formatLog(event)

    if (this.isDevelopment) {
      // Console em development
      this.logToConsole(event, logMessage)
    } else {
      // Em produção, você deve enviar para um serviço centralizado
      this.logToService(event, logMessage)
    }
  }

  /**
   * Log de login bem-sucedido
   */
  logLoginSuccess(email: string, ipAddress: string, userAgent?: string): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'login_success',
      email,
      ipAddress,
      userAgent,
      severity: 'low',
      details: 'User successfully authenticated',
    })
  }

  /**
   * Log de tentativa de login falhada
   */
  logLoginFailed(email: string, ipAddress: string, reason: string, userAgent?: string): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'login_failed',
      email,
      ipAddress,
      userAgent,
      severity: 'medium',
      details: `Failed login: ${reason}`,
    })
  }

  /**
   * Log de rate limit acionado
   */
  logRateLimit(email: string, ipAddress: string, attemptCount: number): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'login_rate_limit',
      email,
      ipAddress,
      severity: 'high',
      details: `Rate limit triggered after ${attemptCount} attempts`,
    })
  }

  /**
   * Log de logout
   */
  logLogout(email: string, ipAddress: string): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'logout',
      email,
      ipAddress,
      severity: 'low',
      details: 'User logged out',
    })
  }

  /**
   * Log de sessão expirada
   */
  logSessionExpired(email: string, ipAddress: string): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'session_expired',
      email,
      ipAddress,
      severity: 'low',
      details: 'Session expired due to inactivity',
    })
  }

  /**
   * Log de acesso não autorizado
   */
  logUnauthorizedAccess(email: string, ipAddress: string, resource: string): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'unauthorized_access',
      email,
      ipAddress,
      severity: 'high',
      details: `Unauthorized access attempt to: ${resource}`,
    })
  }

  /**
   * Log de atividade suspeita
   */
  logSuspiciousActivity(email: string, ipAddress: string, activity: string): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      eventType: 'suspicious_activity',
      email,
      ipAddress,
      severity: 'critical',
      details: `Suspicious activity detected: ${activity}`,
    })
  }

  /**
   * Formata log para exibição
   */
  private formatLog(event: SecurityEvent): string {
    return `[${event.severity.toUpperCase()}] ${event.timestamp} | ${event.eventType} | Email: ${event.email} | IP: ${event.ipAddress} | ${event.details || ''}`
  }

  /**
   * Log para console (development)
   */
  private logToConsole(event: SecurityEvent, message: string): void {
    const colors = {
      low: '\x1b[36m', // Cyan
      medium: '\x1b[33m', // Yellow
      high: '\x1b[31m', // Red
      critical: '\x1b[35m', // Magenta
    }

    const color = colors[event.severity]
    const reset = '\x1b[0m'

    console.log(`${color}[SECURITY]${reset} ${message}`)
  }

  /**
   * Log para serviço centralizado (produção)
   * 
   * TODO: Implementar integração com:
   * - Sentry
   * - DataDog
   * - AWS CloudWatch
   * - ou banco de dados de logs
   */
  private logToService(event: SecurityEvent, message: string): void {
    // Exemplo de integração com Sentry
    if (typeof window === 'undefined' && process.env.SENTRY_DSN) {
      // Server-side only
      // Sentry.captureMessage(message, {
      //   level: this.severityToSentryLevel(event.severity),
      //   tags: {
      //     eventType: event.eventType,
      //     email: event.email,
      //     ip: event.ipAddress,
      //   },
      // })
    }

    // Log para stdout (será capturado por container logs)
    console.log(`${message}`)
  }

  /**
   * Mapeia severidade para nível Sentry
   */
  private severityToSentryLevel(severity: string): 'fatal' | 'error' | 'warning' | 'info' {
    switch (severity) {
      case 'critical':
        return 'fatal'
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
      default:
        return 'info'
    }
  }
}

// Exportar singleton
export const securityLogger = new SecurityLogger()
