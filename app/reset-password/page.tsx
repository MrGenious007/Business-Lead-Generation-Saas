'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthCard, SubmitButton } from '@/components/auth/AuthCard';
import { useAuth } from '@/hooks/use-auth';
import { resetPasswordSchema } from '@/lib/validators/auth';
import { recoverSessionFromUrl, updatePassword } from '@/services/auth';
import type { ResetPasswordFormValues } from '@/types/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveringSession, setIsRecoveringSession] = useState(true);
  const [canResetPassword, setCanResetPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    const syncRecovery = async () => {
      await recoverSessionFromUrl();
      setIsRecoveringSession(false);
    };

    syncRecovery();
  }, []);

  useEffect(() => {
    if (!loading && !isRecoveringSession) {
      setCanResetPassword(Boolean(user));
    }
  }, [isRecoveringSession, loading, user]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!canResetPassword) {
      toast.error('Your reset link is invalid or has expired. Please request a new one.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await updatePassword(values.password);
    setIsSubmitting(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Password updated successfully.');
    router.refresh();
    router.replace('/dashboard');
  };

  if (loading || isRecoveringSession) {
    return (
      <AuthCard
        title="Verifying reset session"
        subtitle="Please wait while we verify your password recovery link."
        footerText="Back to sign in"
        footerHref="/login"
        footerLinkText="Return to login"
      >
        <p className="text-sm text-slate-300">We are validating your secure reset session before showing the password form.</p>
      </AuthCard>
    );
  }

  if (!canResetPassword) {
    return (
      <AuthCard
        title="Reset link required"
        subtitle="This password reset session is no longer active. Request a fresh reset email to continue."
        footerText="Back to sign in"
        footerHref="/login"
        footerLinkText="Return to login"
      >
        <div className="space-y-4 text-sm text-slate-300">
          <p>The reset link may have expired, already been used, or is missing the recovery session.</p>
          <Link href="/forgot-password" className="inline-flex rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400">
            Request another reset link
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Set a strong password for your account."
      footerText="Need help?"
      footerHref="/forgot-password"
      footerLinkText="Request another link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="password">New password</label>
          <input id="password" type="password" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('password')} />
          {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password.message?.toString()}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-2 text-sm text-rose-300">{errors.confirmPassword.message?.toString()}</p>}
        </div>
        <SubmitButton label="Update password" loading={isSubmitting} />
      </form>
    </AuthCard>
  );
}
