-- Isolated Better Auth tables for G-LAB.
-- These names deliberately avoid the legacy `user` / `Session` tables.

CREATE TABLE IF NOT EXISTS glab_auth_user (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(254) CHARACTER SET ascii NOT NULL,
  emailVerified TINYINT(1) NOT NULL DEFAULT 0,
  image TEXT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY glab_auth_user_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_auth_session (
  id VARCHAR(64) NOT NULL,
  expiresAt DATETIME NOT NULL,
  token VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  ipAddress VARCHAR(255) NULL,
  userAgent TEXT NULL,
  userId VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY glab_auth_session_token_unique (token),
  KEY glab_auth_session_user_idx (userId),
  CONSTRAINT glab_auth_session_user_fk FOREIGN KEY (userId)
    REFERENCES glab_auth_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_auth_account (
  id VARCHAR(64) NOT NULL,
  accountId VARCHAR(255) NOT NULL,
  providerId VARCHAR(255) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  accessToken TEXT NULL,
  refreshToken TEXT NULL,
  idToken TEXT NULL,
  accessTokenExpiresAt DATETIME NULL,
  refreshTokenExpiresAt DATETIME NULL,
  scope TEXT NULL,
  password TEXT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY glab_auth_account_user_idx (userId),
  CONSTRAINT glab_auth_account_user_fk FOREIGN KEY (userId)
    REFERENCES glab_auth_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glab_auth_verification (
  id VARCHAR(64) NOT NULL,
  identifier VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY (id),
  KEY glab_auth_verification_identifier_idx (identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
