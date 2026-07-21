import type { ActionResult, ApiResult, RecoveryResult } from '@/types/api';
import type { AuthUser, UserSession } from '@/types/user';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupPayload extends AuthCredentials {
  fullName?: string;
  organizationName?: string;
}

export interface SignupFormValues extends AuthCredentials {
  fullName: string;
  organizationName: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export type LoginFormValues = AuthCredentials;
export type AuthSessionResult = ApiResult<UserSession>;
export type AuthUserResult = ApiResult<AuthUser>;
export type AuthActionResult = ActionResult;
export type AuthRecoveryResult = RecoveryResult;
