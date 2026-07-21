// Shared CRM constants and derived union types
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const COMPANY_STATUSES = ['active', 'inactive', 'archived'] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const CONTACT_STATUSES = ['active', 'inactive', 'archived'] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const DEAL_STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const;
export type DealStage = (typeof DEAL_STAGES)[number];

export const DEAL_STATUSES = ['open', 'won', 'lost'] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ['todo', 'in_progress', 'done', 'cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const NOTE_ENTITY_TYPES = ['company', 'contact', 'lead', 'deal', 'pipeline', 'task'] as const;
export type NoteEntityType = (typeof NOTE_ENTITY_TYPES)[number];

export const ACTIVITY_ENTITY_TYPES = [
  'company',
  'contact',
  'lead',
  'deal',
  'pipeline',
  'stage',
  'task',
  'note',
  'tag',
  'custom_field',
] as const;
export type ActivityEntityType = (typeof ACTIVITY_ENTITY_TYPES)[number];

export const TAG_ENTITY_TYPES = ['company', 'contact', 'lead', 'deal', 'pipeline', 'task'] as const;
export type TagEntityType = (typeof TAG_ENTITY_TYPES)[number];

export const CUSTOM_FIELD_ENTITY_TYPES = ['company', 'contact', 'lead', 'deal', 'pipeline', 'task'] as const;
export type CustomFieldEntityType = (typeof CUSTOM_FIELD_ENTITY_TYPES)[number];

export const CUSTOM_FIELD_TYPES = ['text', 'number', 'boolean', 'date', 'select', 'multi_select', 'json'] as const;
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];

export const ACTIVITY_ACTION_TYPES = ['system', 'user', 'integration', 'automation'] as const;
export type ActivityActionType = (typeof ACTIVITY_ACTION_TYPES)[number];

export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CrmListOptions<T extends string = string> {
  search?: string;
  searchFields?: T[];
  filters?: Record<string, string | string[] | boolean | number | null | undefined>;
  sortBy?: T;
  sortDirection?: SortDirection;
  pagination?: PaginationParams;
}

// Audit fields present on every CRM table
export interface CrmAuditFields {
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface CrmBaseEntity extends CrmAuditFields {
  id: string;
  organization_id: string;
}

export interface Lead extends CrmBaseEntity {
  company_id: string | null;
  owner_id: string | null;
  contact_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  notes: string | null;
  company_name: string | null;
}

export interface Company extends CrmBaseEntity {
  name: string;
  website: string | null;
  industry: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: CompanyStatus;
}

export interface Contact extends CrmBaseEntity {
  company_id: string | null;
  owner_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  status: ContactStatus;
  linkedin_url: string | null;
  notes: string | null;
}

export interface Pipeline extends CrmBaseEntity {
  name: string;
  description: string | null;
  is_default: boolean;
}

export interface PipelineStage extends CrmBaseEntity {
  pipeline_id: string;
  name: string;
  position: number;
  probability: number;
  color: string | null;
  is_closed_won: boolean;
  is_closed_lost: boolean;
}

export interface Deal extends CrmBaseEntity {
  pipeline_id: string | null;
  stage_id: string | null;
  company_id: string | null;
  contact_id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  title: string;
  amount: number | null;
  stage: DealStage;
  status: DealStatus;
  expected_close_date: string | null;
  closed_at: string | null;
  notes: string | null;
}

export interface TaskItem extends CrmBaseEntity {
  owner_id: string | null;
  related_lead_id: string | null;
  related_deal_id: string | null;
  related_company_id: string | null;
  related_contact_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  completed_at: string | null;
}

export interface NoteItem extends CrmBaseEntity {
  entity_type: NoteEntityType;
  entity_id: string | null;
  content: string;
}

export interface ActivityItem extends CrmBaseEntity {
  actor_id: string | null;
  entity_type: ActivityEntityType;
  entity_id: string | null;
  action: string;
  action_type: ActivityActionType;
  details: string | null;
  metadata: Record<string, unknown>;
}

export interface Tag extends CrmBaseEntity {
  name: string;
  color: string | null;
  description: string | null;
}

export interface TagAssignment extends CrmBaseEntity {
  tag_id: string;
  entity_type: TagEntityType;
  entity_id: string;
}

export interface CustomField extends CrmBaseEntity {
  entity_type: CustomFieldEntityType;
  name: string;
  slug: string;
  field_type: CustomFieldType;
  options: unknown[];
  is_required: boolean;
  is_active: boolean;
}

export interface CustomFieldValue extends CrmBaseEntity {
  custom_field_id: string;
  entity_type: CustomFieldEntityType;
  entity_id: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
  value_json: unknown | null;
}

export type CrmEntity =
  | Lead
  | Company
  | Contact
  | Deal
  | Pipeline
  | PipelineStage
  | TaskItem
  | NoteItem
  | ActivityItem
  | Tag
  | TagAssignment
  | CustomField
  | CustomFieldValue;

type CreateInputBase = 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'deleted_at' | 'deleted_by';

type MakeNullableOptional<T> = {
  [K in keyof T as T[K] extends null ? K : never]?: T[K];
} & {
  [K in keyof T as T[K] extends null ? never : K]: T[K];
};

export type LeadCreateInput = MakeNullableOptional<Omit<Lead, CreateInputBase>>;
export type CompanyCreateInput = MakeNullableOptional<Omit<Company, CreateInputBase>>;
export type ContactCreateInput = MakeNullableOptional<Omit<Contact, CreateInputBase>>;
export type PipelineCreateInput = MakeNullableOptional<Omit<Pipeline, CreateInputBase>>;
export type PipelineStageCreateInput = MakeNullableOptional<Omit<PipelineStage, CreateInputBase>>;
export type DealCreateInput = MakeNullableOptional<Omit<Deal, CreateInputBase>>;
export type TaskCreateInput = MakeNullableOptional<Omit<TaskItem, CreateInputBase>>;
export type NoteCreateInput = MakeNullableOptional<Omit<NoteItem, CreateInputBase>>;
export type ActivityCreateInput = MakeNullableOptional<Omit<ActivityItem, CreateInputBase>>;
export type TagCreateInput = MakeNullableOptional<Omit<Tag, CreateInputBase>>;
export type TagAssignmentCreateInput = MakeNullableOptional<Omit<TagAssignment, CreateInputBase>>;
export type CustomFieldCreateInput = MakeNullableOptional<Omit<CustomField, CreateInputBase>>;
export type CustomFieldValueCreateInput = MakeNullableOptional<Omit<CustomFieldValue, CreateInputBase>>;

type UpdateInputBase = CreateInputBase | 'organization_id';

export type LeadUpdateInput = Partial<Omit<Lead, UpdateInputBase>>;
export type CompanyUpdateInput = Partial<Omit<Company, UpdateInputBase>>;
export type ContactUpdateInput = Partial<Omit<Contact, UpdateInputBase>>;
export type PipelineUpdateInput = Partial<Omit<Pipeline, UpdateInputBase>>;
export type PipelineStageUpdateInput = Partial<Omit<PipelineStage, UpdateInputBase>>;
export type DealUpdateInput = Partial<Omit<Deal, UpdateInputBase>>;
export type TaskUpdateInput = Partial<Omit<TaskItem, UpdateInputBase>>;
export type NoteUpdateInput = Partial<Omit<NoteItem, UpdateInputBase>>;
export type ActivityUpdateInput = Partial<Omit<ActivityItem, UpdateInputBase>>;
export type TagUpdateInput = Partial<Omit<Tag, UpdateInputBase>>;
export type TagAssignmentUpdateInput = Partial<Omit<TagAssignment, UpdateInputBase>>;
export type CustomFieldUpdateInput = Partial<Omit<CustomField, UpdateInputBase>>;
export type CustomFieldValueUpdateInput = Partial<Omit<CustomFieldValue, UpdateInputBase>>;

// Form value types used by UI controls and Zod form schemas.
// These intentionally exclude IDs, audit fields, and server-managed defaults.
export interface LeadFormValues {
  full_name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  notes?: string;
  status?: LeadStatus;
  source?: string;
}

export interface CompanyFormValues {
  name: string;
  website?: string;
  industry?: string;
  phone?: string;
  address?: string;
  description?: string;
  status?: CompanyStatus;
}

export interface ContactFormValues {
  full_name: string;
  email?: string;
  phone?: string;
  title?: string;
  company_id?: string;
  status?: ContactStatus;
  linkedin_url?: string;
  notes?: string;
}

export interface DealFormValues {
  title: string;
  amount?: number;
  stage?: DealStage;
  status?: DealStatus;
  company_id?: string;
  contact_id?: string;
  lead_id?: string;
  pipeline_id?: string;
  stage_id?: string;
  expected_close_date?: string;
  notes?: string;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  due_date?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  related_lead_id?: string;
  related_deal_id?: string;
  related_company_id?: string;
  related_contact_id?: string;
}

export interface NoteFormValues {
  content: string;
  entity_type: NoteEntityType;
  entity_id?: string;
}

export interface PipelineFormValues {
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface PipelineStageFormValues {
  pipeline_id: string;
  name: string;
  position: number;
  probability?: number;
  color?: string;
  is_closed_won?: boolean;
  is_closed_lost?: boolean;
}

export interface TagFormValues {
  name: string;
  color?: string;
  description?: string;
}

export interface CustomFieldFormValues {
  entity_type: CustomFieldEntityType;
  name: string;
  slug: string;
  field_type: CustomFieldType;
  options?: unknown[];
  is_required?: boolean;
  is_active?: boolean;
}
