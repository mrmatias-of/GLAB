/**
 * AppError - Classe base para erros da aplicação
 * Padroniza error handling em todos os módulos
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public message: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'AppError'
  }

  static NotFound(resource: string) {
    return new AppError('NOT_FOUND', 404, `${resource} não encontrado`)
  }

  static Unauthorized() {
    return new AppError('UNAUTHORIZED', 401, 'Não autorizado')
  }

  static Forbidden() {
    return new AppError('FORBIDDEN', 403, 'Acesso negado')
  }

  static BadRequest(message: string) {
    return new AppError('BAD_REQUEST', 400, message)
  }

  static TenantMismatch() {
    return new AppError('TENANT_MISMATCH', 403, 'Recurso não pertence a este tenant')
  }

  static Internal(message?: string) {
    return new AppError('INTERNAL_ERROR', 500, message || 'Erro interno do servidor')
  }

  static Validation(field: string, message: string) {
    return new AppError('VALIDATION_ERROR', 400, `${field}: ${message}`)
  }

  toJSON() {
    return {
      code: this.code,
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
    }
  }
}
