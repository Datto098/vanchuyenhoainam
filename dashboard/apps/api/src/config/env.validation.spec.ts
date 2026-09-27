import { randomBytes } from 'node:crypto';
import { envValidationSchema } from './env.validation';

describe('envValidationSchema', () => {
  const validBaseConfig = () => ({
    NODE_ENV: 'development',
    API_PORT: 3001,
    MONGODB_URI: 'mongodb://localhost:27017/auto_tags_test',
    WEB_ORIGIN: 'http://localhost:3000',
    JWT_ACCESS_SECRET: 'a'.repeat(32),
    JWT_REFRESH_SECRET: 'b'.repeat(32),
    TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
  });

  it('validates a complete valid environment configuration and applies defaults', () => {
    const config = validBaseConfig();
    const result = envValidationSchema.validate(config);

    expect(result.error).toBeUndefined();
    const value = result.value as Record<string, unknown>;
    expect(value['NODE_ENV']).toBe('development');
    expect(value['API_PORT']).toBe(3001);
    expect(value['JWT_ACCESS_TTL_SECONDS']).toBe(900);
    expect(value['JWT_REFRESH_TTL_SECONDS']).toBe(604800);
  });

  it('fails when MONGODB_URI is missing or empty', () => {
    const config = validBaseConfig();
    delete (config as Record<string, unknown>).MONGODB_URI;

    const result = envValidationSchema.validate(config);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('MONGODB_URI is required to connect to the database');
  });

  it('fails when JWT_ACCESS_SECRET is under 32 characters', () => {
    const config = {
      ...validBaseConfig(),
      JWT_ACCESS_SECRET: 'too-short',
    };

    const result = envValidationSchema.validate(config);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('JWT_ACCESS_SECRET must be at least 32 characters');
  });

  it('fails when JWT_REFRESH_SECRET is under 32 characters', () => {
    const config = {
      ...validBaseConfig(),
      JWT_REFRESH_SECRET: 'short',
    };

    const result = envValidationSchema.validate(config);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('JWT_REFRESH_SECRET must be at least 32 characters');
  });

  describe('TOKEN_ENCRYPTION_KEY validation', () => {
    it('fails when TOKEN_ENCRYPTION_KEY is missing', () => {
      const config = validBaseConfig();
      delete (config as Record<string, unknown>).TOKEN_ENCRYPTION_KEY;

      const result = envValidationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('TOKEN_ENCRYPTION_KEY is required');
    });

    it('fails when TOKEN_ENCRYPTION_KEY decodes to fewer than 32 bytes', () => {
      const shortKey = randomBytes(16).toString('base64'); // 16 bytes
      const config = {
        ...validBaseConfig(),
        TOKEN_ENCRYPTION_KEY: shortKey,
      };

      const result = envValidationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain(
        'TOKEN_ENCRYPTION_KEY must be a valid base64 string decoding to exactly 32 bytes',
      );
    });

    it('fails when TOKEN_ENCRYPTION_KEY decodes to more than 32 bytes', () => {
      const longKey = randomBytes(48).toString('base64'); // 48 bytes
      const config = {
        ...validBaseConfig(),
        TOKEN_ENCRYPTION_KEY: longKey,
      };

      const result = envValidationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain(
        'TOKEN_ENCRYPTION_KEY must be a valid base64 string decoding to exactly 32 bytes',
      );
    });

    it('succeeds when TOKEN_ENCRYPTION_KEY decodes to exactly 32 bytes', () => {
      const exactKey = randomBytes(32).toString('base64');
      const config = {
        ...validBaseConfig(),
        TOKEN_ENCRYPTION_KEY: exactKey,
      };

      const result = envValidationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('rejects invalid characters even if Node can still decode 32 bytes', () => {
      const validKey = randomBytes(32).toString('base64');
      const result = envValidationSchema.validate({
        ...validBaseConfig(),
        TOKEN_ENCRYPTION_KEY: `${validKey.slice(0, 10)}!!!!${validKey.slice(10)}`,
      });

      expect(result.error?.message).toContain('TOKEN_ENCRYPTION_KEY must be a valid base64 string');
    });

    it('rejects non-canonical base64 containing internal whitespace', () => {
      const validKey = randomBytes(32).toString('base64');
      const result = envValidationSchema.validate({
        ...validBaseConfig(),
        TOKEN_ENCRYPTION_KEY: `${validKey.slice(0, 10)} ${validKey.slice(10)}`,
      });

      expect(result.error?.message).toContain('TOKEN_ENCRYPTION_KEY must be a valid base64 string');
    });
  });

  it('accepts optional CLI and admin seed parameters when formatted properly', () => {
    const config = {
      ...validBaseConfig(),
      ADMIN_EMAIL: 'admin@domain.com',
      ADMIN_PASSWORD: 'secure-password-123',
      ADMIN_FULL_NAME: 'Super Administrator',
    };

    const result = envValidationSchema.validate(config);
    expect(result.error).toBeUndefined();
    const value = result.value as Record<string, unknown>;
    expect(value['ADMIN_EMAIL']).toBe('admin@domain.com');
    expect(value['ADMIN_FULL_NAME']).toBe('Super Administrator');
  });

});
