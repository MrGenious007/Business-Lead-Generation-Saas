'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { recoverSessionFromUrl } from '@/services/auth';

const authRoutes = new Set(['/login', '/signup', '/forgot-password', '/reset-password']);

export function AuthSessionSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const syncRecoverySession = async () => {
      const { error, recovered } = await recoverSessionFromUrl();

      if (!error && recovered) {
        router.refresh();

        if (pathname === '/reset-password' && typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    syncRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'PASSWORD_RECOVERY') {
        router.refresh();

        if (event === 'SIGNED_IN' && authRoutes.has(pathname)) {
          router.replace('/dashboard');
        }

        if (event === 'SIGNED_OUT' && !authRoutes.has(pathname)) {
          router.replace('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  return null;
}