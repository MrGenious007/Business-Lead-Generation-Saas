import { createClient } from '@/lib/supabase/client';
import type { ActionResult, ApiResult } from '@/types/api';
import type {
  Organization,
  OrganizationContext,
  OrganizationInvitation,
  OrganizationMember,
  OrganizationMemberDetails,
  OrganizationMembership,
  OrganizationSettings,
  OrganizationSettingsFormValues,
  OrganizationFormValues,
  Profile,
} from '@/types/organization';
import type { AuthUser } from '@/types/user';
import { PermissionService } from '@/services/permission';
import { UserService } from '@/services/user';

const supabase = createClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildDefaultOrganizationName(user: AuthUser) {
  const organizationName = user.user_metadata.organization_name;
  const fullName = user.user_metadata.full_name;
  const emailName = user.email?.split('@')[0];

  return String(organizationName || fullName || emailName || 'My Organization');
}

async function getAuthenticatedUser(): Promise<ApiResult<AuthUser>> {
  return UserService.getAuthenticatedUser(supabase);
}

async function ensureCurrentProfile(user: AuthUser): Promise<ApiResult<Profile>> {
  return UserService.ensureCurrentProfile(supabase, user);
}

async function listOrganizationMemberships(profileId: string): Promise<ApiResult<OrganizationMembership[]>> {
  return PermissionService.listOrganizationMemberships(supabase, profileId);
}

async function updateActiveOrganization(profileId: string, organizationId: string): Promise<ApiResult<Profile>> {
  return UserService.updateActiveOrganization(supabase, profileId, organizationId);
}

async function bootstrapDefaultOrganization(user: AuthUser, profile: Profile): Promise<ApiResult<OrganizationContext>> {
  const organizationName = buildDefaultOrganizationName(user);
  const baseSlug = slugify(organizationName) || 'organization';
  const slug = `${baseSlug}-${user.id.slice(0, 8)}`;

  let { data: organization, error: organizationError } = await supabase
    .from('organizations')
    .insert({
      name: organizationName,
      slug,
      owner_id: user.id,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (organizationError) {
    const { data: existingOrganization } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (!existingOrganization) {
      return { data: null, error: organizationError.message };
    }

    organization = existingOrganization;
    organizationError = null;
  }

  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .upsert(
      {
        organization_id: organization.id,
        profile_id: user.id,
        role: 'owner',
      },
      { onConflict: 'organization_id,profile_id' },
    )
    .select('id, organization_id, profile_id, role, created_by, updated_by, created_at, updated_at, deleted_at, deleted_by')
    .single();

  if (membershipError) {
    return { data: null, error: membershipError.message };
  }

  const { data: updatedProfile, error: profileError } = await supabase
    .from('profiles')
    .update({ active_organization_id: organization.id, role: 'owner' })
    .eq('id', profile.id)
    .select('*')
    .single();

  if (profileError) {
    return { data: null, error: profileError.message };
  }

  const activeMembership = {
    ...(membership as OrganizationMember),
    organization: organization as Organization,
  } satisfies OrganizationMembership;

  return {
    data: {
      profile: updatedProfile as Profile,
      organizations: [organization as Organization],
      memberships: [activeMembership],
      activeOrganization: organization as Organization,
      activeMembership,
      settings: null,
    } satisfies OrganizationContext,
    error: null,
  };
}

export async function getOrganizationContext(): Promise<ApiResult<OrganizationContext>> {
  const { data: user, error: userError } = await getAuthenticatedUser();

  if (userError || !user) {
    return { data: null, error: userError };
  }

  const { data: profile, error: profileError } = await ensureCurrentProfile(user);

  if (profileError || !profile) {
    return { data: null, error: profileError };
  }

  const { data: memberships, error: membershipsError } = await listOrganizationMemberships(profile.id);

  if (membershipsError) {
    return { data: null, error: membershipsError };
  }

  if (!memberships || memberships.length === 0) {
    return bootstrapDefaultOrganization(user, profile);
  }

  let resolvedProfile = profile;
  let activeMembership = PermissionService.getActiveMembership(profile, memberships);

  if (activeMembership && activeMembership.organization_id !== profile.active_organization_id) {
    const { data: updatedProfile, error: updateError } = await updateActiveOrganization(profile.id, activeMembership.organization_id);

    if (updateError || !updatedProfile) {
      return { data: null, error: updateError };
    }

    resolvedProfile = updatedProfile;
    activeMembership = PermissionService.getActiveMembership(updatedProfile, memberships) ?? activeMembership;
  }

  const activeOrganization = activeMembership?.organization ?? null;
  const { data: settings, error: settingsError } = activeOrganization
    ? await getOrganizationSettings(activeOrganization.id)
    : { data: null, error: null };

  if (settingsError) {
    return { data: null, error: settingsError };
  }

  return {
    data: {
      profile: resolvedProfile,
      organizations: memberships.map((membership) => membership.organization),
      memberships,
      activeOrganization,
      activeMembership,
      settings,
    } satisfies OrganizationContext,
    error: null,
  };
}

export async function getOrganizations() {
  const { data, error } = await getOrganizationContext();

  if (error || !data) {
    return { data: null as Organization[] | null, error };
  }

  return { data: data.organizations, error: null };
}

export async function getOrganizationById(id: string) {
  const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
  return { data: (data as Organization | null) ?? null, error: error?.message ?? null };
}

export async function createOrganization(payload: OrganizationFormValues): Promise<ApiResult<Organization>> {
  const slug = payload.slug || slugify(payload.name);
  const { data: user, error: userError } = await getAuthenticatedUser();

  if (userError || !user) {
    return { data: null, error: userError };
  }

  const { data: profile, error: profileError } = await ensureCurrentProfile(user);

  if (profileError || !profile) {
    return { data: null, error: profileError };
  }

  const { data, error } = await supabase.from('organizations').insert({
    name: payload.name,
    slug,
    industry: payload.industry ?? null,
    website: payload.website ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    description: payload.description ?? null,
    owner_id: user.id,
    created_by: user.id,
    updated_by: user.id,
  }).select().single();

  if (error || !data) {
    return { data: null, error: error?.message ?? null };
  }

  const { error: membershipError } = await supabase.from('organization_members').upsert(
    {
      organization_id: data.id,
      profile_id: user.id,
      role: 'owner',
    },
    { onConflict: 'organization_id,profile_id' },
  );

  if (membershipError) {
    return { data: null, error: membershipError.message };
  }

  if (!profile.active_organization_id) {
    const { error: activeOrganizationError } = await updateActiveOrganization(profile.id, data.id);

    if (activeOrganizationError) {
      return { data: null, error: activeOrganizationError };
    }
  }

  return { data: data as Organization, error: null };
}

export async function updateOrganization(id: string, payload: Partial<OrganizationFormValues>): Promise<ApiResult<Organization>> {
  const { data, error } = await supabase.from('organizations').update(payload).eq('id', id).select().single();
  return { data: (data as Organization | null) ?? null, error: error?.message ?? null };
}

export async function deleteOrganization(id: string): Promise<ActionResult> {
  const { error } = await supabase.from('organizations').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function getOrganizationSettings(organizationId: string): Promise<ApiResult<OrganizationSettings>> {
  const { data, error } = await supabase.from('organization_settings').select('*').eq('organization_id', organizationId).maybeSingle();
  return { data: (data as OrganizationSettings | null) ?? null, error: error?.message ?? null };
}

export async function upsertOrganizationSettings(organizationId: string, payload: OrganizationSettingsFormValues): Promise<ApiResult<OrganizationSettings>> {
  const { data, error } = await supabase.from('organization_settings').upsert({
    organization_id: organizationId,
    timezone: payload.timezone,
    currency: payload.currency,
    notification_email: payload.notificationEmail || null,
    allow_invites: payload.allowInvites,
    auto_assign_leads: payload.autoAssignLeads,
    default_language: payload.defaultLanguage,
  }, {
    onConflict: 'organization_id',
  }).select().single();
  return { data: (data as OrganizationSettings | null) ?? null, error: error?.message ?? null };
}

export async function getOrganizationMembers(organizationId: string): Promise<ApiResult<OrganizationMemberDetails[]>> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('id, organization_id, profile_id, role, created_by, updated_by, created_at, updated_at, deleted_at, deleted_by, profile:profiles(id, email, full_name)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const members = (data ?? []).map((row) => ({
    id: row.id,
    organization_id: row.organization_id,
    profile_id: row.profile_id,
    role: row.role,
    created_by: row.created_by,
    updated_by: row.updated_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    deleted_by: row.deleted_by,
    profile: normalizeSingleRecord(row.profile as { id: string; email: string; full_name: string | null } | { id: string; email: string; full_name: string | null }[] | null),
  })) satisfies OrganizationMemberDetails[];

  return { data: members, error: null };
}

export async function inviteOrganizationMember(organizationId: string, email: string, role: OrganizationMember['role']): Promise<ApiResult<OrganizationInvitation>> {
  const { data, error } = await supabase.from('organization_invitations').insert({
    organization_id: organizationId,
    email,
    role,
    status: 'pending',
  }).select().single();
  return { data: (data as OrganizationInvitation | null) ?? null, error: error?.message ?? null };
}

export async function updateOrganizationMember(id: string, role: OrganizationMember['role']): Promise<ApiResult<OrganizationMember>> {
  const { data, error } = await supabase.from('organization_members').update({ role }).eq('id', id).select().single();
  return { data: (data as OrganizationMember | null) ?? null, error: error?.message ?? null };
}

export async function deleteOrganizationMember(id: string): Promise<ActionResult> {
  const { error } = await supabase.from('organization_members').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function switchActiveOrganization(organizationId: string): Promise<ActionResult> {
  const { data: user, error: userError } = await getAuthenticatedUser();

  if (userError || !user) {
    return { error: userError };
  }

  const { data: profile, error: profileError } = await ensureCurrentProfile(user);

  if (profileError || !profile) {
    return { error: profileError };
  }

  const { count, error: membershipError } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('profile_id', profile.id);

  if (membershipError) {
    return { error: membershipError.message };
  }

  if (!count) {
    return { error: 'You do not have access to this organization.' };
  }

  const { error } = await updateActiveOrganization(profile.id, organizationId);
  return { error };
}

export const OrganizationService = {
  getOrganizationContext,
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationSettings,
  upsertOrganizationSettings,
  getOrganizationMembers,
  inviteOrganizationMember,
  updateOrganizationMember,
  deleteOrganizationMember,
  switchActiveOrganization,
};
