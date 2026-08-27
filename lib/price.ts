/**
 * Converte um preço digitado por humano em centavos.
 *
 * O admin é brasileiro e digita "19,90" naturalmente. Number("19,90") é NaN,
 * e um <input type="number"> chega a entregar "1990" nesse caso — o combo
 * seria salvo por R$ 1.990,00 em vez de R$ 19,90. Aqui tratamos vírgula como
 * separador decimal e aceitamos separador de milhar ("1.234,50").
 */
export function parsePriceToCents(raw: unknown): number {
  const text = String(raw ?? '').trim()
  if (!text) return Number.NaN

  const hasComma = text.includes(',')
  const normalized = hasComma
    ? text.replace(/\./g, '').replace(',', '.') // pt-BR: ponto é milhar, vírgula é decimal
    : text

  // Sem essa checagem, "abc" viraria "" e Number("") é 0: o produto seria
  // salvo de graça em vez de recusar o valor inválido.
  const digits = normalized.replace(/[^\d.-]/g, '')
  if (!/\d/.test(digits)) return Number.NaN

  const value = Number(digits)
  if (!Number.isFinite(value)) return Number.NaN

  return Math.round(value * 100)
}

/** Centavos -> string para preencher um campo de formulário ("19.90"). */
export function centsToInputValue(cents: number) {
  return (cents / 100).toFixed(2)
}
