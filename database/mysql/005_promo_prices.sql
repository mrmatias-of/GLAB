-- 005_promo_prices.sql
-- Adiciona o preço "de" (valor cheio riscado) e aplica a tabela promocional vigente.
-- Guias: R$ 27,90 -> R$ 7,90 | Combo Iniciante Mobile: R$ 197,00 -> R$ 29,90

ALTER TABLE glab_products
  ADD COLUMN compare_at_cents INT UNSIGNED NULL AFTER price_cents;

-- Guias individuais
UPDATE glab_products
SET price_cents = 790,
    compare_at_cents = 2790
WHERE slug <> 'combo-iniciante-mobile';

-- Combo Iniciante Mobile
UPDATE glab_products
SET price_cents = 2990,
    compare_at_cents = 19700
WHERE slug = 'combo-iniciante-mobile';
