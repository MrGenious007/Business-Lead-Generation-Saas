'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthCard, SubmitButton } from '@/components/auth/AuthCard';
import { resetPasswordSchema } from '@/lib/validators/auth';
import { updatePassword } from '@/services/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: { password: string; confirmPassword: string }) => {
    setIsSubmitting(true);
    const { error } = await updatePassword(values.password);
    setIsSubmitting(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Password updated successfully.');
    router.push('/dashboard');
  };

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
