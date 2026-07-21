-- 010_database_foundation.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.organization_members
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.organization_settings
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.organization_members
  ALTER COLUMN organization_id SET NOT NULL,
  ALTER COLUMN profile_id SET NOT NULL,
  ALTER COLUMN role SET NOT NULL;

ALTER TABLE public.organization_settings
  ALTER COLUMN organization_id SET NOT NULL,
  ALTER COLUMN allow_invites SET DEFAULT TRUE,
  ALTER COLUMN auto_assign_leads SET DEFAULT FALSE,
  ALTER COLUMN default_language SET DEFAULT 'en';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_auth_user_id_fkey'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_auth_user_id_fkey
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'organization_members_role_check'
    ) THEN
        ALTER TABLE public.organization_members
        ADD CONSTRAINT organization_members_role_check
        CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS organizations_owner_id_idx ON public.organizations (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS organizations_created_by_idx ON public.organizations (created_by) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS organizations_deleted_at_idx ON public.organizations (deleted_at);
CREATE INDEX IF NOT EXISTS organization_members_organization_role_idx ON public.organization_members (organization_id, role) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS organization_members_profile_id_active_idx ON public.organization_members (profile_id, organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS organization_members_deleted_at_idx ON public.organization_members (deleted_at);
CREATE INDEX IF NOT EXISTS organization_settings_organization_id_active_idx ON public.organization_settings (organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS organization_settings_deleted_at_idx ON public.organization_settings (deleted_at);
CREATE INDEX IF NOT EXISTS profiles_deleted_at_idx ON public.profiles (deleted_at);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
CREATE TRIGGER set_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_organization_members_updated_at ON public.organization_members;
CREATE TRIGGER set_organization_members_updated_at
BEFORE UPDATE ON public.organization_members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_organization_settings_updated_at ON public.organization_settings;
CREATE TRIGGER set_organization_settings_updated_at
BEFORE UPDATE ON public.organization_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

CREATE OR REPLACE FUNCTION public.is_organization_member(target_organization_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members member
    JOIN public.organizations organization ON organization.id = member.organization_id
    JOIN public.profiles profile ON profile.id = member.profile_id
    WHERE member.organization_id = target_organization_id
      AND member.profile_id = auth.uid()
      AND member.deleted_at IS NULL
      AND organization.deleted_at IS NULL
      AND profile.deleted_at IS NULL
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
    FROM public.organization_members member
    JOIN public.organizations organization ON organization.id = member.organization_id
    JOIN public.profiles profile ON profile.id = member.profile_id
    WHERE member.organization_id = target_organization_id
      AND member.profile_id = auth.uid()
      AND member.role = ANY (allowed_roles)
      AND member.deleted_at IS NULL
      AND organization.deleted_at IS NULL
      AND profile.deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.shares_organization_with_profile(target_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members current_member
    JOIN public.organization_members target_member
      ON target_member.organization_id = current_member.organization_id
    JOIN public.organizations organization
      ON organization.id = current_member.organization_id
    JOIN public.profiles target_profile
      ON target_profile.id = target_member.profile_id
    WHERE current_member.profile_id = auth.uid()
      AND target_member.profile_id = target_profile_id
      AND current_member.deleted_at IS NULL
      AND target_member.deleted_at IS NULL
      AND organization.deleted_at IS NULL
      AND target_profile.deleted_at IS NULL
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  deleted_at IS NULL
  AND (id = auth.uid() OR public.shares_organization_with_profile(id))
);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() AND deleted_at IS NULL);

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
USING (deleted_at IS NULL AND public.is_organization_member(id));

DROP POLICY IF EXISTS "organizations_insert_owner" ON public.organizations;
CREATE POLICY "organizations_insert_owner"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (
  deleted_at IS NULL
  AND (owner_id = auth.uid() OR created_by = auth.uid())
);

DROP POLICY IF EXISTS "organizations_update_admin" ON public.organizations;
CREATE POLICY "organizations_update_admin"
ON public.organizations
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(id, ARRAY['owner', 'admin']))
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
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "organization_members_insert_admin" ON public.organization_members;
CREATE POLICY "organization_members_insert_admin"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  deleted_at IS NULL
  AND public.has_organization_role(organization_id, ARRAY['owner', 'admin'])
);

DROP POLICY IF EXISTS "organization_members_update_manager" ON public.organization_members;
CREATE POLICY "organization_members_update_manager"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']))
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
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "organization_settings_insert_admin" ON public.organization_settings;
CREATE POLICY "organization_settings_insert_admin"
ON public.organization_settings
FOR INSERT
TO authenticated
WITH CHECK (
  deleted_at IS NULL
  AND public.has_organization_role(organization_id, ARRAY['owner', 'admin'])
);

DROP POLICY IF EXISTS "organization_settings_update_admin" ON public.organization_settings;
CREATE POLICY "organization_settings_update_admin"
ON public.organization_settings
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin']))
WITH CHECK (public.has_organization_role(organization_id, ARRAY['owner', 'admin']));