'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthCard, SubmitButton } from '@/components/auth/AuthCard';
import { signupSchema } from '@/lib/validators/auth';
import { signUpWithPassword } from '@/services/auth';

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: { fullName: string; organizationName: string; email: string; password: string }) => {
    setIsSubmitting(true);
    const { data, error } = await signUpWithPassword(values);
    setIsSubmitting(false);

    if (error) {
      toast.error(error);
      return;
    }

    if (data.user?.identities?.length === 0) {
      toast.error('This email is already registered.');
      return;
    }

    toast.success('Account created. Please check your email to confirm sign in.');
    router.push('/dashboard');
  };

  return (
    <AuthCard
      title="Create your workspace"
      subtitle="Set up your organization and start generating growth opportunities."
      footerText="Already have an account?"
      footerHref="/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="fullName">Full name</label>
          <input id="fullName" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('fullName')} />
          {errors.fullName && <p className="mt-2 text-sm text-rose-300">{errors.fullName.message?.toString()}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="organizationName">Organization name</label>
          <input id="organizationName" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('organizationName')} />
          {errors.organizationName && <p className="mt-2 text-sm text-rose-300">{errors.organizationName.message?.toString()}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('email')} />
          {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email.message?.toString()}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="password">Password</label>
          <input id="password" type="password" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none" {...register('password')} />
          {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password.message?.toString()}</p>}
        </div>
        <SubmitButton label="Create account" loading={isSubmitting} />
      </form>
    </AuthCard>
  );
}
