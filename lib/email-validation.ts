// Espelha o contrato real da API do PagBank para customer.email.
// Verificado no sandbox: tamanho entre 5 e 60 caracteres, parte local com
// no máximo 64 caracteres do conjunto ASCII abaixo e domínio com até 5 pontos.
// Sem esta checagem o PagBank devolve apenas "must match ..." e o comprador
// recebe um "Confira o campo e-mail" sem saber o que corrigir.

export const PAGBANK_EMAIL_MIN_LENGTH = 5
export const PAGBANK_EMAIL_MAX_LENGTH = 60

const LOCAL_ALLOWED = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}$/
const DOMAIN_LABEL = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/

/** Normaliza o e-mail do mesmo modo que é gravado e enviado ao PagBank. */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

/**
 * Retorna null quando o e-mail é aceito pelo PagBank, ou uma mensagem em
 * português explicando exatamente o que está errado.
 */
export function validateEmailForPagBank(rawValue: string): string | null {
  const email = normalizeEmail(rawValue)

  if (!email) return 'Informe seu e-mail para receber o acesso.'

  const atCount = (email.match(/@/g) ?? []).length
  if (atCount === 0) return 'O e-mail precisa conter @ (exemplo: nome@email.com).'
  if (atCount > 1) return 'O e-mail deve conter apenas um @.'

  if (email.length < PAGBANK_EMAIL_MIN_LENGTH) return 'E-mail muito curto. Confira se está completo.'
  if (email.length > PAGBANK_EMAIL_MAX_LENGTH) {
    return `O PagBank aceita e-mails de até ${PAGBANK_EMAIL_MAX_LENGTH} caracteres, e o seu tem ${email.length}. Use um e-mail mais curto.`
  }

  const [local, domain] = email.split('@')

  if (!local) return 'Informe a parte do e-mail antes do @.'
  if (local.length > 64) return 'A parte antes do @ é longa demais.'
  if (!LOCAL_ALLOWED.test(local)) {
    const invalid = [...local].find(char => !/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]/.test(char))
    return invalid
      ? `O caractere "${invalid}" não é aceito em e-mails. Remova acentos, espaços e símbolos como vírgula.`
      : 'A parte antes do @ contém caracteres não aceitos.'
  }

  if (!domain) return 'Informe o domínio depois do @ (exemplo: gmail.com).'

  const labels = domain.split('.')
  if (labels.length < 2) return 'O domínio precisa ter um final como .com ou .com.br.'
  if (labels.length > 6) return 'O domínio do e-mail tem pontos demais. Confira se está correto.'
  if (labels.some(label => label.length === 0)) {
    return 'O domínio tem um ponto sobrando. Confira se não digitou ".." ou ponto no final.'
  }
  const badLabel = labels.find(label => !DOMAIN_LABEL.test(label))
  if (badLabel !== undefined) {
    return `A parte "${badLabel}" do domínio é inválida. Use apenas letras, números e hífen entre eles.`
  }
  if (!/^[a-zA-Z]{2,}$/.test(labels[labels.length - 1])) {
    return 'O final do e-mail deve ter apenas letras (exemplo: .com, .com.br).'
  }

  return null
}
