-- Emissão de certificados de conclusão de curso.
-- Safe, additive migration for MySQL 5.7+ / InnoDB.
-- Guarda o registro de emissão (código de verificação + data) para auditoria;
-- o PDF em si é gerado sob demanda a partir destes dados, não é armazenado.

CREATE TABLE IF NOT EXISTS glab_certificates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  enrollment_id CHAR(36) NOT NULL,
  code CHAR(12) NOT NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY glab_certificates_enrollment_unique (enrollment_id),
  UNIQUE KEY glab_certificates_code_unique (code),
  CONSTRAINT glab_certificates_enrollment_fk FOREIGN KEY (enrollment_id) REFERENCES glab_enrollments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
