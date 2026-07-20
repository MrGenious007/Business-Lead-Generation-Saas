import { createClient } from '@/lib/supabase/client';
import type { Organization, OrganizationInvitation, OrganizationMember, OrganizationSettings, OrganizationSettingsFormValues, OrganizationFormValues } from '@/types/organization';

const supabase = createClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getOrganizations() {
  const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
  return { data: data as Organization[] | null, error: error?.message };
}

export async function getOrganizationById(id: string) {
  const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
  return { data: data as Organization | null, error: error?.message };
}

export async function createOrganization(payload: OrganizationFormValues) {
  const slug = payload.slug || slugify(payload.name);
  const { data, error } = await supabase.from('organizations').insert({
    name: payload.name,
    slug,
    industry: payload.industry ?? null,
    website: payload.website ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    description: payload.description ?? null,
  }).select().single();
  return { data: data as Organization | null, error: error?.message };
}

export async function updateOrganization(id: string, payload: Partial<OrganizationFormValues>) {
  const { data, error } = await supabase.from('organizations').update(payload).eq('id', id).select().single();
  return { data: data as Organization | null, error: error?.message };
}

export async function deleteOrganization(id: string) {
  const { error } = await supabase.from('organizations').delete().eq('id', id);
  return { error: error?.message };
}

export async function getOrganizationSettings(organizationId: string) {
  const { data, error } = await supabase.from('organization_settings').select('*').eq('organization_id', organizationId).maybeSingle();
  return { data: data as OrganizationSettings | null, error: error?.message };
}

export async function upsertOrganizationSettings(organizationId: string, payload: OrganizationSettingsFormValues) {
  const { data, error } = await supabase.from('organization_settings').upsert({
    organization_id: organizationId,
    timezone: payload.timezone,
    currency: payload.currency,
    notification_email: payload.notificationEmail || null,
    allow_invites: payload.allowInvites,
    auto_assign_leads: payload.autoAssignLeads,
    default_language: payload.defaultLanguage,
  }).select().single();
  return { data: data as OrganizationSettings | null, error: error?.message };
}

export async function getOrganizationMembers(organizationId: string) {
  const { data, error } = await supabase.from('organization_members').select('*').eq('organization_id', organizationId).order('created_at', { ascending: false });
  return { data: data as OrganizationMember[] | null, error: error?.message };
}

export async function inviteOrganizationMember(organizationId: string, email: string, role: OrganizationMember['role']) {
  const { data, error } = await supabase.from('organization_invitations').insert({
    organization_id: organizationId,
    email,
    role,
    status: 'pending',
  }).select().single();
  return { data: data as OrganizationInvitation | null, error: error?.message };
}

export async function updateOrganizationMember(id: string, role: OrganizationMember['role']) {
  const { data, error } = await supabase.from('organization_members').update({ role }).eq('id', id).select().single();
  return { data: data as OrganizationMember | null, error: error?.message };
}

export async function deleteOrganizationMember(id: string) {
  const { error } = await supabase.from('organization_members').delete().eq('id', id);
  return { error: error?.message };
}
