import { createClient } from '@/lib/supabase/client';
import type { ActivityItem, Company, Contact, Deal, Lead, NoteItem, Pipeline, TaskItem } from '@/types/crm';

const supabase = createClient();

export async function getLeads() {
  const { data, error } = await supabase.from('crm_leads').select('*').order('created_at', { ascending: false });
  return { data: data as Lead[] | null, error: error?.message };
}

export async function createLead(payload: Lead) {
  const { data, error } = await supabase.from('crm_leads').insert(payload).select().single();
  return { data: data as Lead | null, error: error?.message };
}

export async function updateLead(id: string, payload: Partial<Lead>) {
  const { data, error } = await supabase.from('crm_leads').update(payload).eq('id', id).select().single();
  return { data: data as Lead | null, error: error?.message };
}

export async function getCompanies() {
  const { data, error } = await supabase.from('crm_companies').select('*').order('created_at', { ascending: false });
  return { data: data as Company[] | null, error: error?.message };
}

export async function createCompany(payload: Company) {
  const { data, error } = await supabase.from('crm_companies').insert(payload).select().single();
  return { data: data as Company | null, error: error?.message };
}

export async function getContacts() {
  const { data, error } = await supabase.from('crm_contacts').select('*').order('created_at', { ascending: false });
  return { data: data as Contact[] | null, error: error?.message };
}

export async function getDeals() {
  const { data, error } = await supabase.from('crm_deals').select('*').order('created_at', { ascending: false });
  return { data: data as Deal[] | null, error: error?.message };
}

export async function createDeal(payload: Deal) {
  const { data, error } = await supabase.from('crm_deals').insert(payload).select().single();
  return { data: data as Deal | null, error: error?.message };
}

export async function getPipelines() {
  const { data, error } = await supabase.from('crm_pipelines').select('*').order('created_at', { ascending: false });
  return { data: data as Pipeline[] | null, error: error?.message };
}

export async function createTask(payload: TaskItem) {
  const { data, error } = await supabase.from('crm_tasks').insert(payload).select().single();
  return { data: data as TaskItem | null, error: error?.message };
}

export async function getTasks() {
  const { data, error } = await supabase.from('crm_tasks').select('*').order('due_date', { ascending: true });
  return { data: data as TaskItem[] | null, error: error?.message };
}

export async function createNote(payload: NoteItem) {
  const { data, error } = await supabase.from('crm_notes').insert(payload).select().single();
  return { data: data as NoteItem | null, error: error?.message };
}

export async function getActivityTimeline() {
  const { data, error } = await supabase.from('crm_activity').select('*').order('created_at', { ascending: false });
  return { data: data as ActivityItem[] | null, error: error?.message };
}
