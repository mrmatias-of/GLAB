-- Vincula o cupom ao pedido para contabilizar somente compras pagas.
ALTER TABLE glab_orders
  ADD COLUMN coupon_id BIGINT UNSIGNED NULL,
  ADD KEY glab_orders_coupon_idx (coupon_id),
  ADD CONSTRAINT glab_orders_coupon_fk FOREIGN KEY (coupon_id) REFERENCES glab_coupons(id);
