import type { Session, User } from '@supabase/supabase-js';

export interface AppUserMetadata {
  full_name?: string;
  organization_name?: string;
  role?: string;
}

export type AuthUser = Omit<User, 'user_metadata'> & {
  user_metadata: AppUserMetadata;
};

export interface UserSession {
  user: AuthUser | null;
  session: Session | null;
}

export function toAuthUser(user: User | null): AuthUser | null {
  return user as AuthUser | null;
}

export function toUserSession(session: { user: User | null; session: Session | null } | null): UserSession | null {
  if (!session) {
    return null;
  }

  return {
    user: toAuthUser(session.user),
    session: session.session,
  };
}