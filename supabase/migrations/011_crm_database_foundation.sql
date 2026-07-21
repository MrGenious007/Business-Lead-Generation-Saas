-- 011_crm_database_foundation.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.crm_companies
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.crm_companies
  ALTER COLUMN organization_id SET NOT NULL,
  ALTER COLUMN name SET NOT NULL;

ALTER TABLE public.crm_leads
  ADD COLUMN IF NOT EXISTS contact_id UUID,
  ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS source VARCHAR(100),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.crm_leads
  ALTER COLUMN organization_id SET NOT NULL,
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  title VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  linkedin_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  pipeline_id UUID NOT NULL REFERENCES public.crm_pipelines(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  probability INTEGER NOT NULL DEFAULT 0,
  color VARCHAR(32),
  is_closed_won BOOLEAN NOT NULL DEFAULT FALSE,
  is_closed_lost BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES public.crm_pipelines(id) ON DELETE SET NULL,
  stage_id UUID REFERENCES public.crm_pipeline_stages(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2),
  stage VARCHAR(50) NOT NULL DEFAULT 'lead',
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  expected_close_date DATE,
  closed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  related_lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  related_deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  related_company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  related_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(50) NOT NULL DEFAULT 'todo',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  action VARCHAR(255) NOT NULL,
  action_type VARCHAR(50) NOT NULL DEFAULT 'system',
  details TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(32),
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.crm_tags(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  custom_field_id UUID NOT NULL REFERENCES public.crm_custom_fields(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  value_text TEXT,
  value_number NUMERIC,
  value_boolean BOOLEAN,
  value_date DATE,
  value_json JSONB,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_leads_contact_id_fkey'
  ) THEN
    ALTER TABLE public.crm_leads
      ADD CONSTRAINT crm_leads_contact_id_fkey
      FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_pipeline_stages_probability_check'
  ) THEN
    ALTER TABLE public.crm_pipeline_stages
      ADD CONSTRAINT crm_pipeline_stages_probability_check
      CHECK (probability >= 0 AND probability <= 100);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_pipeline_stages_unique_position'
  ) THEN
    ALTER TABLE public.crm_pipeline_stages
      ADD CONSTRAINT crm_pipeline_stages_unique_position
      UNIQUE (pipeline_id, position);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS crm_pipelines_unique_default_per_org
  ON public.crm_pipelines (organization_id)
  WHERE is_default = TRUE AND deleted_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_tags_org_name_key'
  ) THEN
    ALTER TABLE public.crm_tags
      ADD CONSTRAINT crm_tags_org_name_key UNIQUE (organization_id, name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_tag_assignments_unique_tag_entity'
  ) THEN
    ALTER TABLE public.crm_tag_assignments
      ADD CONSTRAINT crm_tag_assignments_unique_tag_entity UNIQUE (tag_id, entity_type, entity_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_custom_fields_org_entity_slug_key'
  ) THEN
    ALTER TABLE public.crm_custom_fields
      ADD CONSTRAINT crm_custom_fields_org_entity_slug_key UNIQUE (organization_id, entity_type, slug);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_custom_field_values_unique_field_entity'
  ) THEN
    ALTER TABLE public.crm_custom_field_values
      ADD CONSTRAINT crm_custom_field_values_unique_field_entity UNIQUE (custom_field_id, entity_type, entity_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_contacts_status_check'
  ) THEN
    ALTER TABLE public.crm_contacts
      ADD CONSTRAINT crm_contacts_status_check CHECK (status IN ('active', 'inactive', 'archived'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_companies_status_check'
  ) THEN
    ALTER TABLE public.crm_companies
      ADD CONSTRAINT crm_companies_status_check CHECK (status IN ('active', 'inactive', 'archived'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_tasks_priority_check'
  ) THEN
    ALTER TABLE public.crm_tasks
      ADD CONSTRAINT crm_tasks_priority_check CHECK (priority IN ('low', 'medium', 'high'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_notes_entity_type_check'
  ) THEN
    ALTER TABLE public.crm_notes
      ADD CONSTRAINT crm_notes_entity_type_check CHECK (entity_type IN ('company', 'contact', 'lead', 'deal', 'pipeline', 'task'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_activity_entity_type_check'
  ) THEN
    ALTER TABLE public.crm_activity
      ADD CONSTRAINT crm_activity_entity_type_check CHECK (entity_type IN ('company', 'contact', 'lead', 'deal', 'pipeline', 'stage', 'task', 'note', 'tag', 'custom_field'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_tag_assignments_entity_type_check'
  ) THEN
    ALTER TABLE public.crm_tag_assignments
      ADD CONSTRAINT crm_tag_assignments_entity_type_check CHECK (entity_type IN ('company', 'contact', 'lead', 'deal', 'pipeline', 'task'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_custom_fields_entity_type_check'
  ) THEN
    ALTER TABLE public.crm_custom_fields
      ADD CONSTRAINT crm_custom_fields_entity_type_check CHECK (entity_type IN ('company', 'contact', 'lead', 'deal', 'pipeline', 'task'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_custom_fields_field_type_check'
  ) THEN
    ALTER TABLE public.crm_custom_fields
      ADD CONSTRAINT crm_custom_fields_field_type_check CHECK (field_type IN ('text', 'number', 'boolean', 'date', 'select', 'multi_select', 'json'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'crm_custom_field_values_entity_type_check'
  ) THEN
    ALTER TABLE public.crm_custom_field_values
      ADD CONSTRAINT crm_custom_field_values_entity_type_check CHECK (entity_type IN ('company', 'contact', 'lead', 'deal', 'pipeline', 'task'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS crm_companies_org_active_idx ON public.crm_companies (organization_id, name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_leads_org_status_idx ON public.crm_leads (organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_contacts_org_company_idx ON public.crm_contacts (organization_id, company_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_deals_org_pipeline_stage_idx ON public.crm_deals (organization_id, pipeline_id, stage_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_tasks_org_due_date_idx ON public.crm_tasks (organization_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_notes_org_entity_idx ON public.crm_notes (organization_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_activity_org_entity_idx ON public.crm_activity (organization_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_tags_org_name_idx ON public.crm_tags (organization_id, name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_tag_assignments_org_entity_idx ON public.crm_tag_assignments (organization_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_custom_fields_org_entity_idx ON public.crm_custom_fields (organization_id, entity_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_custom_field_values_org_entity_idx ON public.crm_custom_field_values (organization_id, entity_type, entity_id) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_crm_companies_updated_at ON public.crm_companies;
CREATE TRIGGER set_crm_companies_updated_at
BEFORE UPDATE ON public.crm_companies
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_leads_updated_at ON public.crm_leads;
CREATE TRIGGER set_crm_leads_updated_at
BEFORE UPDATE ON public.crm_leads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_contacts_updated_at ON public.crm_contacts;
CREATE TRIGGER set_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_pipelines_updated_at ON public.crm_pipelines;
CREATE TRIGGER set_crm_pipelines_updated_at
BEFORE UPDATE ON public.crm_pipelines
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_pipeline_stages_updated_at ON public.crm_pipeline_stages;
CREATE TRIGGER set_crm_pipeline_stages_updated_at
BEFORE UPDATE ON public.crm_pipeline_stages
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_deals_updated_at ON public.crm_deals;
CREATE TRIGGER set_crm_deals_updated_at
BEFORE UPDATE ON public.crm_deals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_tasks_updated_at ON public.crm_tasks;
CREATE TRIGGER set_crm_tasks_updated_at
BEFORE UPDATE ON public.crm_tasks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_notes_updated_at ON public.crm_notes;
CREATE TRIGGER set_crm_notes_updated_at
BEFORE UPDATE ON public.crm_notes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_activity_updated_at ON public.crm_activity;
CREATE TRIGGER set_crm_activity_updated_at
BEFORE UPDATE ON public.crm_activity
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_tags_updated_at ON public.crm_tags;
CREATE TRIGGER set_crm_tags_updated_at
BEFORE UPDATE ON public.crm_tags
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_custom_fields_updated_at ON public.crm_custom_fields;
CREATE TRIGGER set_crm_custom_fields_updated_at
BEFORE UPDATE ON public.crm_custom_fields
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_crm_custom_field_values_updated_at ON public.crm_custom_field_values;
CREATE TRIGGER set_crm_custom_field_values_updated_at
BEFORE UPDATE ON public.crm_custom_field_values
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_custom_field_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crm_companies_select_member" ON public.crm_companies;
CREATE POLICY "crm_companies_select_member"
ON public.crm_companies
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_companies_write_member" ON public.crm_companies;
CREATE POLICY "crm_companies_write_member"
ON public.crm_companies
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_leads_select_member" ON public.crm_leads;
CREATE POLICY "crm_leads_select_member"
ON public.crm_leads
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_leads_write_member" ON public.crm_leads;
CREATE POLICY "crm_leads_write_member"
ON public.crm_leads
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_contacts_select_member" ON public.crm_contacts;
CREATE POLICY "crm_contacts_select_member"
ON public.crm_contacts
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_contacts_write_member" ON public.crm_contacts;
CREATE POLICY "crm_contacts_write_member"
ON public.crm_contacts
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_deals_select_member" ON public.crm_deals;
CREATE POLICY "crm_deals_select_member"
ON public.crm_deals
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_deals_write_member" ON public.crm_deals;
CREATE POLICY "crm_deals_write_member"
ON public.crm_deals
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_pipelines_select_member" ON public.crm_pipelines;
CREATE POLICY "crm_pipelines_select_member"
ON public.crm_pipelines
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_pipelines_write_manager" ON public.crm_pipelines;
CREATE POLICY "crm_pipelines_write_manager"
ON public.crm_pipelines
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']));

DROP POLICY IF EXISTS "crm_pipeline_stages_select_member" ON public.crm_pipeline_stages;
CREATE POLICY "crm_pipeline_stages_select_member"
ON public.crm_pipeline_stages
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_pipeline_stages_write_manager" ON public.crm_pipeline_stages;
CREATE POLICY "crm_pipeline_stages_write_manager"
ON public.crm_pipeline_stages
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']));

DROP POLICY IF EXISTS "crm_tasks_select_member" ON public.crm_tasks;
CREATE POLICY "crm_tasks_select_member"
ON public.crm_tasks
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_tasks_write_member" ON public.crm_tasks;
CREATE POLICY "crm_tasks_write_member"
ON public.crm_tasks
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_notes_select_member" ON public.crm_notes;
CREATE POLICY "crm_notes_select_member"
ON public.crm_notes
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_notes_write_member" ON public.crm_notes;
CREATE POLICY "crm_notes_write_member"
ON public.crm_notes
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_activity_select_member" ON public.crm_activity;
CREATE POLICY "crm_activity_select_member"
ON public.crm_activity
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_activity_write_member" ON public.crm_activity;
CREATE POLICY "crm_activity_write_member"
ON public.crm_activity
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_tags_select_member" ON public.crm_tags;
CREATE POLICY "crm_tags_select_member"
ON public.crm_tags
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_tags_write_manager" ON public.crm_tags;
CREATE POLICY "crm_tags_write_manager"
ON public.crm_tags
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']));

DROP POLICY IF EXISTS "crm_tag_assignments_select_member" ON public.crm_tag_assignments;
CREATE POLICY "crm_tag_assignments_select_member"
ON public.crm_tag_assignments
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_tag_assignments_write_member" ON public.crm_tag_assignments;
CREATE POLICY "crm_tag_assignments_write_member"
ON public.crm_tag_assignments
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

DROP POLICY IF EXISTS "crm_custom_fields_select_member" ON public.crm_custom_fields;
CREATE POLICY "crm_custom_fields_select_member"
ON public.crm_custom_fields
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_custom_fields_write_manager" ON public.crm_custom_fields;
CREATE POLICY "crm_custom_fields_write_manager"
ON public.crm_custom_fields
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager']));

DROP POLICY IF EXISTS "crm_custom_field_values_select_member" ON public.crm_custom_field_values;
CREATE POLICY "crm_custom_field_values_select_member"
ON public.crm_custom_field_values
FOR SELECT
TO authenticated
USING (deleted_at IS NULL AND public.is_organization_member(organization_id));

DROP POLICY IF EXISTS "crm_custom_field_values_write_member" ON public.crm_custom_field_values;
CREATE POLICY "crm_custom_field_values_write_member"
ON public.crm_custom_field_values
FOR ALL
TO authenticated
USING (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']))
WITH CHECK (deleted_at IS NULL AND public.has_organization_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));