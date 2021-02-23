// ============================================================
// 			ENV VARIABLES
// ============================================================
export const __PROD__ = process.env.NODE_ENV === 'production';

export const PORT = parseInt(process.env.PORT) || 4000;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'localhost:3000';
export const DATABASE_URL = process.env.DATABASE_URL || 'postgres://admin:password@localhost:5432/Test';
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379/0';
export const SESSION_ID = process.env.SESSION_ID || 'SID';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'Secret P@ssword';

// ============================================================
// 			REDIS PREFIX CONSTANTS
// ============================================================
export const REDIS_PREFIX_COOKIE_SESSION = 'ActiveSessions:';
export const REDIS_PREFIX_USER_SESSION_LIST = 'UserSessionList:';
export const REDIS_PREFIX_WRONG_PASSWORD = 'WrongPasswordAttempts:';
export const REDIS_PREFIX_FORGOT_PASSWORD = 'ForgotPasswordLinks:';
export const REDIS_PREFIX_CONFIRM_EMAIL = 'UserConfirmPassword:';

// ============================================================
// 			ERROR RESPONSES
// ============================================================
export const ERROR_NOT_AUTHENTICATED = 'NOT AUTHENTICATED - PLEASE LOGIN';
export const ERROR_NOT_AUTHORIZED = 'NOT AUTHORIZED';
export const ERROR_INVALID_LOGIN = 'Invalid Email and/or Password';
export const ERROR_ACCOUNT_LOCKED = 'This account is locked. Please contact your system administrator.';
export const ERROR_EMAIL_UNCONFIRMED = 'Email Unconfirmed. Please confirm email before logging in.';
export const ERROR_INVALID_RESET_PASSWORD_LINK = 'Invalid link. Please request a new forgot password email';
export const ERROR_UNKNOWN_ERROR = 'Something went wrong. Try again in a few minutes';
