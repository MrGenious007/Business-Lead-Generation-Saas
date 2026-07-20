'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AuthCard, SubmitButton } from '@/components/auth/AuthCard';
import { loginSchema } from '@/lib/validators/auth';
import { signInWithPassword } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    const { data, error } = await signInWithPassword(values);
    setIsSubmitting(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Signed in successfully.');
    router.push(searchParams.get('redirectTo') || '/dashboard');
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue managing growth, leads, and campaigns."
      footerText="New here?"
      footerHref="/signup"
      footerLinkText="Create an account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none ring-0" {...register('email')} />
          {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email.message?.toString()}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="password">Password</label>
          <input id="password" type="password" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none ring-0" {...register('password')} />
          {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password.message?.toString()}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-cyan-300 transition hover:text-cyan-200">
            Forgot password?
          </Link>
        </div>
        <SubmitButton label="Sign in" loading={isSubmitting} />
      </form>
    </AuthCard>
  );
}
