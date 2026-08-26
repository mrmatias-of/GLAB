-- G-LAB coupons for the platform backoffice.
-- Safe, additive migration for MySQL 5.7+ / InnoDB.
-- Coupons are stored now so the backoffice can manage them; applying them at
-- checkout is implemented in the checkout/pedidos milestone.

CREATE TABLE IF NOT EXISTS glab_coupons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(40) NOT NULL,
  description VARCHAR(200) NULL,
  discount_type VARCHAR(16) NOT NULL DEFAULT 'PERCENT',
  discount_value INT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  max_redemptions INT UNSIGNED NULL,
  redeemed_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  expires_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY glab_coupons_code_unique (code),
  KEY glab_coupons_product_idx (product_id),
  KEY glab_coupons_active_idx (is_active),
  CONSTRAINT glab_coupons_product_fk FOREIGN KEY (product_id) REFERENCES glab_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
