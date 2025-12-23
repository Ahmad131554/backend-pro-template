// Application-wide configuration constants

export const APP_CONFIG = {
  // API Configuration
  API: {
    VERSION: 'v1',
    PREFIX: '/api/v1',
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },

  // File Upload Configuration
  UPLOADS: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    PROFILE_PICTURE_PATH: 'uploads/profiles/'
  },

  // Security Configuration
  SECURITY: {
    BCRYPT_ROUNDS: 12,
    JWT_EXPIRY: '24h',
    RESET_TOKEN_EXPIRY: '10m',
    OTP_LENGTH: 6,
    OTP_EXPIRY_MINUTES: 10,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15
  },

  // Rate Limiting
  RATE_LIMITS: {
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 5
    },
    GENERAL: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100
    }
  },

  // Database
  DATABASE: {
    CONNECTION_TIMEOUT: 10000,
    SOCKET_TIMEOUT: 45000
  }
} as const;