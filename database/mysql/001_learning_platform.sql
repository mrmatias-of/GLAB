-- G-LAB learning platform
-- Safe, additive migration for MySQL 5.7+ / InnoDB.
-- Run once in the glabcursos_db database.

CREATE TABLE IF NOT EXISTS glab_products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  cover_url VARCHAR(2048) NULL,
  price_cents INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY glab_products_slug_unique (slug),
  KEY glab_products_active_idx (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_orders (
  id CHAR(36) NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  reference_id VARCHAR(64) NOT NULL,
  buyer_name VARCHAR(160) NULL,
  buyer_email VARCHAR(254) CHARACTER SET ascii NOT NULL,
  amount_cents INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  pagbank_checkout_id VARCHAR(100) NULL,
  pagbank_order_id VARCHAR(100) NULL,
  paid_at DATETIME NULL,
  canceled_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY glab_orders_reference_unique (reference_id),
  UNIQUE KEY glab_orders_pagbank_checkout_unique (pagbank_checkout_id),
  KEY glab_orders_buyer_email_idx (buyer_email),
  KEY glab_orders_status_idx (status),
  CONSTRAINT glab_orders_product_fk FOREIGN KEY (product_id) REFERENCES glab_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_enrollments (
  id CHAR(36) NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  order_id CHAR(36) NOT NULL,
  student_user_id VARCHAR(100) NULL,
  student_email VARCHAR(254) CHARACTER SET ascii NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY glab_enrollments_student_product_unique (student_email, product_id),
  UNIQUE KEY glab_enrollments_order_unique (order_id),
  KEY glab_enrollments_student_user_idx (student_user_id),
  KEY glab_enrollments_status_idx (status),
  CONSTRAINT glab_enrollments_product_fk FOREIGN KEY (product_id) REFERENCES glab_products(id),
  CONSTRAINT glab_enrollments_order_fk FOREIGN KEY (order_id) REFERENCES glab_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_lessons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  position INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  lesson_type VARCHAR(32) NOT NULL DEFAULT 'PDF',
  content_url VARCHAR(2048) NULL,
  is_preview TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY glab_lessons_product_position_unique (product_id, position),
  KEY glab_lessons_active_idx (product_id, is_active),
  CONSTRAINT glab_lessons_product_fk FOREIGN KEY (product_id) REFERENCES glab_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_lesson_progress (
  enrollment_id CHAR(36) NOT NULL,
  lesson_id BIGINT UNSIGNED NOT NULL,
  completed_at DATETIME NULL,
  last_opened_at DATETIME NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (enrollment_id, lesson_id),
  CONSTRAINT glab_lesson_progress_enrollment_fk FOREIGN KEY (enrollment_id) REFERENCES glab_enrollments(id),
  CONSTRAINT glab_lesson_progress_lesson_fk FOREIGN KEY (lesson_id) REFERENCES glab_lessons(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_payment_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider VARCHAR(32) NOT NULL,
  provider_event_id VARCHAR(120) NULL,
  order_id CHAR(36) NULL,
  event_type VARCHAR(80) NOT NULL,
  payment_status VARCHAR(32) NULL,
  payload_sha256 CHAR(64) NOT NULL,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY glab_payment_events_provider_event_unique (provider, provider_event_id),
  KEY glab_payment_events_order_idx (order_id),
  KEY glab_payment_events_status_idx (payment_status),
  CONSTRAINT glab_payment_events_order_fk FOREIGN KEY (order_id) REFERENCES glab_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
