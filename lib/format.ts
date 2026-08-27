/** Formata centavos em Real brasileiro: 790 -> "R$ 7,90" */
export function brl(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

/** Percentual de desconto arredondado entre o preço cheio e o preço cobrado. */
export function discountPercent(compareAtCents: number | null | undefined, priceCents: number) {
  if (!compareAtCents || compareAtCents <= priceCents) return null
  return Math.round((1 - priceCents / compareAtCents) * 100)
}
