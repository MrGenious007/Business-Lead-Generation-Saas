'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/services/auth';
import { supabase } from '@/lib/supabase/client';
import { toAuthUser, type AuthUser } from '@/types/user';

interface UseAuthState {
  user: AuthUser | null;
  loading: boolean;
}

export function useAuth(): UseAuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await AuthService.getAuthenticatedUser(supabase);
      setUser(data);
      setLoading(false);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
