export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  module: string
  message: string
  data?: any
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development'

  private format(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level}] [${entry.module}] ${entry.message}`
  }

  private log(level: LogLevel, module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data,
    }

    const formatted = this.format(entry)

    if (this.isDev) {
      console.log(formatted, data ? data : '')
    }

    // Log to external service in production (Sentry, LogRocket, etc.)
    if (!this.isDev && level === LogLevel.ERROR) {
      this.logToExternal(entry)
    }
  }

  private logToExternal(entry: LogEntry) {
    // Implement external logging (Sentry, LogRocket, Datadog, etc.)
    // Example: Sentry.captureException(entry)
  }

  debug(module: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, module, message, data)
  }

  info(module: string, message: string, data?: any) {
    this.log(LogLevel.INFO, module, message, data)
  }

  warn(module: string, message: string, data?: any) {
    this.log(LogLevel.WARN, module, message, data)
  }

  error(module: string, message: string, error?: any) {
    this.log(LogLevel.ERROR, module, message, error)
  }
}

export const logger = new Logger()
