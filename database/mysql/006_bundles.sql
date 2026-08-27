-- Combos (bundles): define quais cursos um produto libera na compra.
--
-- Um produto sem linhas aqui é um curso comum e libera apenas a si mesmo.
-- Um produto com linhas é um combo: a compra libera cada curso listado,
-- e o combo em si não gera matrícula (ele não tem aulas próprias).

CREATE TABLE IF NOT EXISTS glab_product_bundle_items (
  bundle_product_id BIGINT UNSIGNED NOT NULL,
  item_product_id BIGINT UNSIGNED NOT NULL,
  position INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (bundle_product_id, item_product_id),
  KEY glab_bundle_items_item_idx (item_product_id),
  CONSTRAINT glab_bundle_items_bundle_fk FOREIGN KEY (bundle_product_id)
    REFERENCES glab_products (id) ON DELETE CASCADE,
  CONSTRAINT glab_bundle_items_item_fk FOREIGN KEY (item_product_id)
    REFERENCES glab_products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- O índice UNIQUE em order_id limitava cada pedido a UMA matrícula, o que
-- torna impossível liberar os vários cursos de um combo com um só pedido.
-- Passa a ser um índice comum (a unicidade real é student_email+product_id).
--
-- A ordem importa: o índice novo precisa existir ANTES de remover o UNIQUE,
-- porque a foreign key de order_id exige um índice disponível a todo
-- momento. Invertendo, o MySQL falha com ER_DROP_INDEX_FK (errno 1553).
ALTER TABLE glab_enrollments ADD KEY glab_enrollments_order_idx (order_id);
ALTER TABLE glab_enrollments DROP INDEX glab_enrollments_order_unique;
