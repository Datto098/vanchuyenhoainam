export type EntityId = string;

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiErrorResponse = {
  success: false;
  errorCode: ErrorCode;
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
  details?: Record<string, unknown>;
};

export const ErrorCode = {
  INTERNAL_SERVER_ERROR: 'ERR_1000',
  VALIDATION_ERROR: 'ERR_1001',
  NOT_FOUND: 'ERR_1002',
  UNAUTHORIZED: 'ERR_1003',
  FORBIDDEN: 'ERR_1004',
  BAD_REQUEST: 'ERR_1005',
  TOO_MANY_REQUESTS: 'ERR_1006',
  AUTH_INVALID_CREDENTIALS: 'ERR_2000',
  AUTH_INVALID_REFRESH_TOKEN: 'ERR_2001',
  AUTH_ACCOUNT_DISABLED: 'ERR_2002',
  USER_NOT_FOUND: 'ERR_2100',
  USER_EMAIL_EXISTS: 'ERR_2101',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
