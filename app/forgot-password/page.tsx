'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthCard, SubmitButton } from '@/components/auth/AuthCard';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import { resetPasswordForEmail } from '@/services/auth';
import type { ForgotPasswordFormValues } from '@/types/auth';

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    const { error } = await resetPasswordForEmail(values.email);
    setIsSubmitting(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Password reset email sent. Please check your inbox.');
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We will send a secure reset link to your email address."
      footerText="Remembered it?"
      footerHref="/login"
      footerLinkText="Back to sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('email')} />
          {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email.message?.toString()}</p>}
        </div>
        <SubmitButton label="Send reset link" loading={isSubmitting} />
      </form>
    </AuthCard>
  );
}
