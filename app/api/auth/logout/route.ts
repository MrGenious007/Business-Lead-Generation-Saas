import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AuthService } from '@/services/auth';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  await AuthService.signOutWithClient(supabase);

  const redirectUrl = new URL('/login', request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}