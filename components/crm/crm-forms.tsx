"use client";

import { useState } from 'react';
import { createLead, createCompany, createDeal, createTask, createNote } from '@/services/crm';

export function LeadForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({ full_name: '', email: '', company_name: '', notes: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createLead({ ...form, status: 'new' });
    setLoading(false);
    if (!result.error) {
      setForm({ full_name: '', email: '', company_name: '', notes: '' });
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Company" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
      <textarea className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Saving…' : 'Add lead'}</button>
    </form>
  );
}

export function CompanyForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({ name: '', website: '', industry: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createCompany({ ...form });
    setLoading(false);
    if (!result.error) {
      setForm({ name: '', website: '', industry: '' });
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
      <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Saving…' : 'Add company'}</button>
    </form>
  );
}

export function DealForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({ title: '', amount: '', stage: 'lead' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createDeal({ title: form.title, amount: Number(form.amount || 0), stage: form.stage });
    setLoading(false);
    if (!result.error) {
      setForm({ title: '', amount: '', stage: 'lead' });
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Deal title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
        <option value="lead">Lead</option>
        <option value="qualified">Qualified</option>
        <option value="proposal">Proposal</option>
        <option value="negotiation">Negotiation</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Saving…' : 'Add deal'}</button>
    </form>
  );
}

export function TaskForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({ title: '', due_date: '', priority: 'medium' as const });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createTask({ title: form.title, due_date: form.due_date || null, priority: form.priority, status: 'todo' });
    setLoading(false);
    if (!result.error) {
      setForm({ title: '', due_date: '', priority: 'medium' });
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
      <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Saving…' : 'Add task'}</button>
    </form>
  );
}

export function NoteForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({ content: '', entity_type: 'lead' as const });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createNote({ content: form.content, entity_type: form.entity_type });
    setLoading(false);
    if (!result.error) {
      setForm({ content: '', entity_type: 'lead' });
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <textarea className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Write a note" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
      <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" value={form.entity_type} onChange={(e) => setForm({ ...form, entity_type: e.target.value as 'lead' | 'company' | 'deal' | 'contact' })}>
        <option value="lead">Lead</option>
        <option value="company">Company</option>
        <option value="deal">Deal</option>
        <option value="contact">Contact</option>
      </select>
      <button type="submit" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Saving…' : 'Add note'}</button>
    </form>
  );
}
