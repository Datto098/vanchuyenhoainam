import { ErrorCode, type ErrorCode as ErrorCodeType } from '@auto-tags/shared-types';
import { useI18nStore } from '@/lib/i18n/i18n-store';
import type { SupportedLocale } from '@/lib/i18n/i18n-types';

const vi: Record<ErrorCodeType, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Đã xảy ra lỗi hệ thống.',
  [ErrorCode.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ.',
  [ErrorCode.NOT_FOUND]: 'Không tìm thấy tài nguyên.',
  [ErrorCode.UNAUTHORIZED]: 'Bạn cần đăng nhập.',
  [ErrorCode.FORBIDDEN]: 'Bạn không có quyền thực hiện thao tác này.',
  [ErrorCode.BAD_REQUEST]: 'Yêu cầu không hợp lệ.',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Bạn thao tác quá nhanh.',
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng.',
  [ErrorCode.AUTH_INVALID_REFRESH_TOKEN]: 'Phiên đăng nhập đã hết hạn.',
  [ErrorCode.AUTH_ACCOUNT_DISABLED]: 'Tài khoản đã bị vô hiệu hóa.',
  [ErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng.',
  [ErrorCode.USER_EMAIL_EXISTS]: 'Email này đã được sử dụng.',
};
const en: Record<ErrorCodeType, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An internal error occurred.',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid input.',
  [ErrorCode.NOT_FOUND]: 'Resource not found.',
  [ErrorCode.UNAUTHORIZED]: 'Authentication required.',
  [ErrorCode.FORBIDDEN]: 'Access denied.',
  [ErrorCode.BAD_REQUEST]: 'Bad request.',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Too many requests.',
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',
  [ErrorCode.AUTH_INVALID_REFRESH_TOKEN]: 'Session expired.',
  [ErrorCode.AUTH_ACCOUNT_DISABLED]: 'Account disabled.',
  [ErrorCode.USER_NOT_FOUND]: 'User not found.',
  [ErrorCode.USER_EMAIL_EXISTS]: 'Email already in use.',
};

export function getErrorMessage(code: string, serverMessage?: string, locale?: SupportedLocale) {
  if (code === ErrorCode.VALIDATION_ERROR && serverMessage) return serverMessage;
  const selected = locale ?? useI18nStore.getState().locale;
  if (code === 'NETWORK_ERROR') {
    return selected === 'en' ? 'Unable to connect to server.' : 'Không thể kết nối máy chủ.';
  }
  return (
    (selected === 'en' ? en : vi)[code as ErrorCodeType] ??
    (selected === 'en' ? 'Unknown error.' : 'Đã xảy ra lỗi.')
  );
}
