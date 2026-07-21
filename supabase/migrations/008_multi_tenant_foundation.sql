-- 008_multi_tenant_foundation.sql

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS active_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS description TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'organization_members_organization_profile_key'
    ) THEN
        ALTER TABLE organization_members
        ADD CONSTRAINT organization_members_organization_profile_key UNIQUE (organization_id, profile_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'organization_settings_organization_id_key'
    ) THEN
        ALTER TABLE organization_settings
        ADD CONSTRAINT organization_settings_organization_id_key UNIQUE (organization_id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS organization_members_profile_id_idx ON organization_members (profile_id);
CREATE INDEX IF NOT EXISTS organization_invitations_organization_id_idx ON organization_invitations (organization_id);
CREATE INDEX IF NOT EXISTS profiles_active_organization_id_idx ON profiles (active_organization_id);