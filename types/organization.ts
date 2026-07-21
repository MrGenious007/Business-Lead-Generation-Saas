export type OrganizationRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: OrganizationRole | null;
  active_organization_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  owner_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface OrganizationFormValues {
  name: string;
  slug?: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface OrganizationSettings {
  id: string;
  organization_id: string;
  timezone: string | null;
  currency: string | null;
  notification_email: string | null;
  allow_invites: boolean;
  auto_assign_leads: boolean;
  default_language: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface OrganizationSettingsFormValues {
  timezone: string;
  currency: string;
  notificationEmail?: string;
  allowInvites: boolean;
  autoAssignLeads: boolean;
  defaultLanguage: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  profile_id: string;
  role: OrganizationRole;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface OrganizationMembership extends OrganizationMember {
  organization: Organization;
}

export interface OrganizationMemberProfile {
  id: string;
  email: string;
  full_name: string | null;
}

export interface OrganizationMemberDetails extends OrganizationMember {
  profile: OrganizationMemberProfile | null;
}

export type OrganizationInvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrganizationRole;
  status: OrganizationInvitationStatus;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
}

export interface OrganizationContext {
  profile: Profile;
  organizations: Organization[];
  memberships: OrganizationMembership[];
  activeOrganization: Organization | null;
  activeMembership: OrganizationMembership | null;
  settings: OrganizationSettings | null;
}
