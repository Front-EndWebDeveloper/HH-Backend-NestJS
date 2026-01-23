// Application-wide constants
export const SETTINGS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  JWT: {
    DEFAULT_EXPIRES_IN: '1h',
    REFRESH_EXPIRES_IN: '7d',
  },
  HIPAA: {
    AUDIT_LOG_RETENTION_DAYS: 2555, // 7 years
    ENCRYPTION_ALGORITHM: 'AES-256-GCM',
    MIN_PASSWORD_LENGTH: 12,
    SESSION_TIMEOUT_MINUTES: 15,
  },
} as const;

