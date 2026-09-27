import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  API_PORT: Joi.number().port().default(3001),
  API_BODY_LIMIT: Joi.string()
    .trim()
    .pattern(/^\d+(?:b|kb|mb)$/i)
    .default('2mb'),
  TRUST_PROXY_HOPS: Joi.number().integer().min(0).default(1),
  MONGODB_URI: Joi.string().trim().required().messages({
    'any.required': 'MONGODB_URI is required to connect to the database',
    'string.empty': 'MONGODB_URI cannot be empty',
  }),
  WEB_ORIGIN: Joi.string().uri().default('http://localhost:3000'),
  JWT_ACCESS_SECRET: Joi.string().min(32).required().messages({
    'any.required': 'JWT_ACCESS_SECRET is required for authentication',
    'string.min': 'JWT_ACCESS_SECRET must be at least 32 characters for security',
  }),
  JWT_REFRESH_SECRET: Joi.string().min(32).required().messages({
    'any.required': 'JWT_REFRESH_SECRET is required for session refresh tokens',
    'string.min': 'JWT_REFRESH_SECRET must be at least 32 characters for security',
  }),
  JWT_ACCESS_TTL_SECONDS: Joi.number().integer().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: Joi.number().integer().positive().default(604800),
  TOKEN_ENCRYPTION_KEY: Joi.string()
    .trim()
    .required()
    .custom((val: string, helpers) => {
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(val) || val.length % 4 !== 0) {
        return helpers.error('tokenEncryptionKey.invalid');
      }
      const decoded = Buffer.from(val, 'base64');
      if (decoded.toString('base64') !== val) {
        return helpers.error('tokenEncryptionKey.invalid');
      }
      if (decoded.length !== 32) {
        return helpers.error('tokenEncryptionKey.length');
      }
      return val;
    })
    .messages({
      'any.required':
        'TOKEN_ENCRYPTION_KEY is required for AES-256-GCM encryption of store secrets',
      'tokenEncryptionKey.length':
        'TOKEN_ENCRYPTION_KEY must be a valid base64 string decoding to exactly 32 bytes (generate with: openssl rand -base64 32)',
      'tokenEncryptionKey.invalid': 'TOKEN_ENCRYPTION_KEY must be a valid base64 string',
    }),
  LOG_PRETTY: Joi.boolean().default(false),
  ADMIN_EMAIL: Joi.string().email().optional(),
  ADMIN_PASSWORD: Joi.string().min(8).optional(),
  ADMIN_FULL_NAME: Joi.string().optional(),
  API_PUBLIC_URL: Joi.string()
    .uri({ scheme: ['https'] })
    .allow('')
    .optional(),
  OPENAI_API_KEY: Joi.string().allow('').optional(),
  EXTENSION_API_TOKEN: Joi.string().allow('').optional(),
  ORDER_API_URL: Joi.string().uri().default('https://vanchuyenhoainam.vn/src/api/cart/add'),
  USD_TO_VND_RATE: Joi.number().positive().default(26000),
  AI_ORDER_RATE_LIMIT_PER_MINUTE: Joi.number().integer().positive().default(5),
  AI_ORDER_IP_RATE_LIMIT_PER_MINUTE: Joi.number().integer().positive().default(20),
  AI_ORDER_MAX_PENDING_PER_USER: Joi.number().integer().positive().default(2),
});
