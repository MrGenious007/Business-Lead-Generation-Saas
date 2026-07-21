-- 009_rbac_policies.sql

CREATE OR REPLACE FUNCTION public.is_organization_member(target_organization_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = target_organization_id
      AND profile_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_organization_role(target_organization_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = target_organization_id
      AND profile_id = auth.uid()
      AND role = ANY (allowed_roles)
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "organizations_select_member" ON public.organizations;
CREATE POLICY "organizations_select_member"
ON public.organizations
FOR SELECT
TO authenticated
USING (public.is_organization_member(id));

DROP POLICY IF EXISTS "organizations_insert_owner" ON public.organizations;
CREATE POLICY "organizations_insert_owner"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid() OR created_by = auth.uid());

DROP POLICY IF EXISTS "organizations_update_admin" ON public.organizations;
CREATE POLICY "organizations_update_admin"
ON public.organizations
FOR UPDATE
TO authenticated
USING (public.has_organization_role(id, ARRAY['owner', 'admin']))
WITH CHECK (public.has_organization_role(id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organizations_delete_owner" ON public.organizations;
CREATE POLICY "organizations_delete_owner"
ON public.organizations
FOR DELETE
TO authenticated
USING (public.has_organization_role(id, ARRAY['owner']));

DROP POLICY IF EXISTS "organization_members_select_member" ON public.organization_members;
CREATE POLICY "organization_members_select_member"
ON public.organization_members
FOR SELECT
TO authenticated
USING (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "organization_members_insert_admin" ON public.organization_members;
CREATE POLICY "organization_members_insert_admin"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organization_members_update_manager" ON public.organization_members;
CREATE POLICY "organization_members_update_manager"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']))
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']));

DROP POLICY IF EXISTS "organization_members_delete_admin" ON public.organization_members;
CREATE POLICY "organization_members_delete_admin"
ON public.organization_members
FOR DELETE
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organization_settings_select_member" ON public.organization_settings;
CREATE POLICY "organization_settings_select_member"
ON public.organization_settings
FOR SELECT
TO authenticated
USING (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "organization_settings_insert_admin" ON public.organization_settings;
CREATE POLICY "organization_settings_insert_admin"
ON public.organization_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organization_settings_update_admin" ON public.organization_settings;
CREATE POLICY "organization_settings_update_admin"
ON public.organization_settings
FOR UPDATE
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin']))
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organization_invitations_select_member_manager" ON public.organization_invitations;
CREATE POLICY "organization_invitations_select_member_manager"
ON public.organization_invitations
FOR SELECT
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']));

DROP POLICY IF EXISTS "organization_invitations_insert_admin" ON public.organization_invitations;
CREATE POLICY "organization_invitations_insert_admin"
ON public.organization_invitations
FOR INSERT
TO authenticated
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organization_invitations_update_admin" ON public.organization_invitations;
CREATE POLICY "organization_invitations_update_admin"
ON public.organization_invitations
FOR UPDATE
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin']))
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "organization_invitations_delete_admin" ON public.organization_invitations;
CREATE POLICY "organization_invitations_delete_admin"
ON public.organization_invitations
FOR DELETE
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "crm_companies_select_member" ON public.crm_companies;
CREATE POLICY "crm_companies_select_member"
ON public.crm_companies
FOR SELECT
TO authenticated
USING (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_companies_write_member" ON public.crm_companies;
CREATE POLICY "crm_companies_write_member"
ON public.crm_companies
FOR ALL
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_leads_select_member" ON public.crm_leads;
CREATE POLICY "crm_leads_select_member"
ON public.crm_leads
FOR SELECT
TO authenticated
USING (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_leads_write_member" ON public.crm_leads;
CREATE POLICY "crm_leads_write_member"
ON public.crm_leads
FOR ALL
TO authenticated
USING (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));