import { z } from 'zod';
import {
  ACTIVITY_ACTION_TYPES,
  ACTIVITY_ENTITY_TYPES,
  COMPANY_STATUSES,
  CONTACT_STATUSES,
  CUSTOM_FIELD_ENTITY_TYPES,
  CUSTOM_FIELD_TYPES,
  DEAL_STATUSES,
  DEAL_STAGES,
  LEAD_STATUSES,
  NOTE_ENTITY_TYPES,
  TAG_ENTITY_TYPES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@/types/crm';

const uuid = z.string().uuid();
const optionalUuid = uuid.nullable().optional();
const requiredString = z.string().min(1, 'This field is required');
const optionalString = z.string().nullable().optional();
const optionalLongText = z.string().max(5000).nullable().optional();
const optionalDate = z.string().date().nullable().optional();

export const leadStatusSchema = z.enum(LEAD_STATUSES);
export const companyStatusSchema = z.enum(COMPANY_STATUSES);
export const contactStatusSchema = z.enum(CONTACT_STATUSES);
export const dealStageSchema = z.enum(DEAL_STAGES);
export const dealStatusSchema = z.enum(DEAL_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);
export const taskStatusSchema = z.enum(TASK_STATUSES);
export const noteEntityTypeSchema = z.enum(NOTE_ENTITY_TYPES);
export const activityEntityTypeSchema = z.enum(ACTIVITY_ENTITY_TYPES);
export const tagEntityTypeSchema = z.enum(TAG_ENTITY_TYPES);
export const customFieldEntityTypeSchema = z.enum(CUSTOM_FIELD_ENTITY_TYPES);
export const customFieldTypeSchema = z.enum(CUSTOM_FIELD_TYPES);
export const activityActionTypeSchema = z.enum(ACTIVITY_ACTION_TYPES);

const auditFieldsSchema = z.object({
  created_by: optionalUuid,
  updated_by: optionalUuid,
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
  deleted_by: optionalUuid,
});

const baseEntitySchema = z.object({
  id: uuid.optional(),
  organization_id: uuid,
});

const leadFields = {
  company_id: optionalUuid,
  owner_id: optionalUuid,
  contact_id: optionalUuid,
  full_name: requiredString.max(255, 'Full name must be 255 characters or less'),
  email: z.string().email('Enter a valid email address').max(255).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  status: leadStatusSchema.default('new'),
  source: z.string().max(100).nullable().optional(),
  notes: optionalLongText,
  company_name: z.string().max(255).nullable().optional(),
};

const companyFields = {
  name: requiredString.max(255, 'Company name must be 255 characters or less'),
  website: z.string().max(255).nullable().optional(),
  industry: z.string().max(100).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  address: optionalLongText,
  description: optionalLongText,
  status: companyStatusSchema.default('active'),
};

const contactFields = {
  company_id: optionalUuid,
  owner_id: optionalUuid,
  full_name: requiredString.max(255, 'Full name must be 255 characters or less'),
  email: z.string().email('Enter a valid email address').max(255).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  title: z.string().max(255).nullable().optional(),
  status: contactStatusSchema.default('active'),
  linkedin_url: optionalLongText,
  notes: optionalLongText,
};

const pipelineFields = {
  name: requiredString.max(255, 'Pipeline name must be 255 characters or less'),
  description: optionalLongText,
  is_default: z.boolean().default(false),
};

const pipelineStageFields = {
  pipeline_id: uuid,
  name: requiredString.max(255, 'Stage name must be 255 characters or less'),
  position: z.number().int('Position must be a whole number').min(0, 'Position must be 0 or greater'),
  probability: z.number().int().min(0).max(100).default(0),
  color: z.string().max(32).nullable().optional(),
  is_closed_won: z.boolean().default(false),
  is_closed_lost: z.boolean().default(false),
};

const dealFields = {
  pipeline_id: optionalUuid,
  stage_id: optionalUuid,
  company_id: optionalUuid,
  contact_id: optionalUuid,
  lead_id: optionalUuid,
  owner_id: optionalUuid,
  title: requiredString.max(255, 'Deal title must be 255 characters or less'),
  amount: z.number().nonnegative('Amount must be 0 or greater').nullable().optional(),
  stage: dealStageSchema.default('lead'),
  status: dealStatusSchema.default('open'),
  expected_close_date: optionalDate,
  closed_at: z.string().datetime().nullable().optional(),
  notes: optionalLongText,
};

const taskFields = {
  owner_id: optionalUuid,
  related_lead_id: optionalUuid,
  related_deal_id: optionalUuid,
  related_company_id: optionalUuid,
  related_contact_id: optionalUuid,
  title: requiredString.max(255, 'Task title must be 255 characters or less'),
  description: optionalLongText,
  due_date: optionalDate,
  priority: taskPrioritySchema.default('medium'),
  status: taskStatusSchema.default('todo'),
  completed_at: z.string().datetime().nullable().optional(),
};

const noteFields = {
  entity_type: noteEntityTypeSchema,
  entity_id: optionalUuid,
  content: requiredString.max(5000, 'Note must be 5000 characters or less'),
};

const activityFields = {
  actor_id: optionalUuid,
  entity_type: activityEntityTypeSchema,
  entity_id: optionalUuid,
  action: requiredString.max(255, 'Action must be 255 characters or less'),
  action_type: activityActionTypeSchema.default('system'),
  details: optionalLongText,
  metadata: z.record(z.string(), z.unknown()).default({}),
};

const tagFields = {
  name: requiredString.max(100, 'Tag name must be 100 characters or less'),
  color: z.string().max(32).nullable().optional(),
  description: optionalLongText,
};

const tagAssignmentFields = {
  tag_id: uuid,
  entity_type: tagEntityTypeSchema,
  entity_id: uuid,
};

const customFieldFields = {
  entity_type: customFieldEntityTypeSchema,
  name: requiredString.max(255, 'Field name must be 255 characters or less'),
  slug: requiredString.max(255, 'Slug must be 255 characters or less'),
  field_type: customFieldTypeSchema,
  options: z.array(z.unknown()).default([]),
  is_required: z.boolean().default(false),
  is_active: z.boolean().default(true),
};

const customFieldValueFields = {
  custom_field_id: uuid,
  entity_type: customFieldEntityTypeSchema,
  entity_id: uuid,
  value_text: optionalString,
  value_number: z.number().nullable().optional(),
  value_boolean: z.boolean().nullable().optional(),
  value_date: optionalDate,
  value_json: z.unknown().nullable().optional(),
};

export const leadSchema = baseEntitySchema.merge(auditFieldsSchema).extend(leadFields);
export const companySchema = baseEntitySchema.merge(auditFieldsSchema).extend(companyFields);
export const contactSchema = baseEntitySchema.merge(auditFieldsSchema).extend(contactFields);
export const pipelineSchema = baseEntitySchema.merge(auditFieldsSchema).extend(pipelineFields);
export const pipelineStageSchema = z
  .object(pipelineStageFields)
  .merge(baseEntitySchema)
  .merge(auditFieldsSchema)
  .refine(
    (data) => !(data.is_closed_won && data.is_closed_lost),
    {
      path: ['is_closed_lost'],
      message: 'A stage cannot be both closed won and closed lost',
    },
  );
export const dealSchema = baseEntitySchema.merge(auditFieldsSchema).extend(dealFields);
export const taskSchema = baseEntitySchema.merge(auditFieldsSchema).extend(taskFields);
export const noteSchema = baseEntitySchema.merge(auditFieldsSchema).extend(noteFields);
export const activitySchema = baseEntitySchema.merge(auditFieldsSchema).extend(activityFields);
export const tagSchema = baseEntitySchema.merge(auditFieldsSchema).extend(tagFields);
export const tagAssignmentSchema = baseEntitySchema.merge(auditFieldsSchema.omit({ updated_by: true, updated_at: true })).extend(tagAssignmentFields);
export const customFieldSchema = baseEntitySchema.merge(auditFieldsSchema).extend(customFieldFields);
export const customFieldValueSchema = baseEntitySchema.merge(auditFieldsSchema).extend(customFieldValueFields);

export const leadCreateSchema = baseEntitySchema.extend(leadFields);
export const companyCreateSchema = baseEntitySchema.extend(companyFields);
export const contactCreateSchema = baseEntitySchema.extend(contactFields);
export const pipelineCreateSchema = baseEntitySchema.extend(pipelineFields);
export const pipelineStageCreateSchema = z.object(pipelineStageFields).merge(baseEntitySchema);
export const dealCreateSchema = baseEntitySchema.extend(dealFields);
export const taskCreateSchema = baseEntitySchema.extend(taskFields);
export const noteCreateSchema = baseEntitySchema.extend(noteFields);
export const activityCreateSchema = baseEntitySchema.extend(activityFields);
export const tagCreateSchema = baseEntitySchema.extend(tagFields);
export const tagAssignmentCreateSchema = baseEntitySchema.extend(tagAssignmentFields);
export const customFieldCreateSchema = baseEntitySchema.extend(customFieldFields);
export const customFieldValueCreateSchema = baseEntitySchema.extend(customFieldValueFields);

export const leadUpdateSchema = z.object(leadFields).partial();
export const companyUpdateSchema = z.object(companyFields).partial();
export const contactUpdateSchema = z.object(contactFields).partial();
export const pipelineUpdateSchema = z.object(pipelineFields).partial();
export const pipelineStageUpdateSchema = z.object(pipelineStageFields).partial();
export const dealUpdateSchema = z.object(dealFields).partial();
export const taskUpdateSchema = z.object(taskFields).partial();
export const noteUpdateSchema = z.object(noteFields).partial();
export const activityUpdateSchema = z.object(activityFields).partial();
export const tagUpdateSchema = z.object(tagFields).partial();
export const tagAssignmentUpdateSchema = z.object(tagAssignmentFields).partial();
export const customFieldUpdateSchema = z.object(customFieldFields).partial();
export const customFieldValueUpdateSchema = z.object(customFieldValueFields).partial();

export const leadFormSchema = z.object({
  full_name: requiredString.max(255, 'Full name must be 255 characters or less'),
  email: z.string().email('Enter a valid email address').max(255).optional(),
  phone: z.string().max(50).optional(),
  company_name: z.string().max(255).optional(),
  notes: z.string().max(5000).optional(),
  status: leadStatusSchema.optional(),
  source: z.string().max(100).optional(),
});

export const companyFormSchema = z.object({
  name: requiredString.max(255, 'Company name must be 255 characters or less'),
  website: z.string().max(255).optional(),
  industry: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  address: z.string().max(5000).optional(),
  description: z.string().max(5000).optional(),
  status: companyStatusSchema.optional(),
});

export const contactFormSchema = z.object({
  full_name: requiredString.max(255, 'Full name must be 255 characters or less'),
  email: z.string().email('Enter a valid email address').max(255).optional(),
  phone: z.string().max(50).optional(),
  title: z.string().max(255).optional(),
  company_id: uuid.optional(),
  status: contactStatusSchema.optional(),
  linkedin_url: z.string().max(5000).optional(),
  notes: z.string().max(5000).optional(),
});

export const dealFormSchema = z.object({
  title: requiredString.max(255, 'Deal title must be 255 characters or less'),
  amount: z.number().nonnegative('Amount must be 0 or greater').optional(),
  stage: dealStageSchema.optional(),
  status: dealStatusSchema.optional(),
  company_id: uuid.optional(),
  contact_id: uuid.optional(),
  lead_id: uuid.optional(),
  pipeline_id: uuid.optional(),
  stage_id: uuid.optional(),
  expected_close_date: z.string().date().optional(),
  notes: z.string().max(5000).optional(),
});

export const taskFormSchema = z.object({
  title: requiredString.max(255, 'Task title must be 255 characters or less'),
  description: z.string().max(5000).optional(),
  due_date: z.string().date().optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
  related_lead_id: uuid.optional(),
  related_deal_id: uuid.optional(),
  related_company_id: uuid.optional(),
  related_contact_id: uuid.optional(),
});

export const noteFormSchema = z.object({
  content: requiredString.max(5000, 'Note must be 5000 characters or less'),
  entity_type: noteEntityTypeSchema,
  entity_id: uuid.optional(),
});

export const pipelineFormSchema = z.object({
  name: requiredString.max(255, 'Pipeline name must be 255 characters or less'),
  description: z.string().max(5000).optional(),
  is_default: z.boolean().optional(),
});

export const pipelineStageFormSchema = z
  .object({
    pipeline_id: uuid,
    name: requiredString.max(255, 'Stage name must be 255 characters or less'),
    position: z.number().int().min(0),
    probability: z.number().int().min(0).max(100).optional(),
    color: z.string().max(32).optional(),
    is_closed_won: z.boolean().optional(),
    is_closed_lost: z.boolean().optional(),
  })
  .refine(
    (data) => !(data.is_closed_won && data.is_closed_lost),
    {
      path: ['is_closed_lost'],
      message: 'A stage cannot be both closed won and closed lost',
    },
  );

export const tagFormSchema = z.object({
  name: requiredString.max(100, 'Tag name must be 100 characters or less'),
  color: z.string().max(32).optional(),
  description: z.string().max(5000).optional(),
});

export const customFieldFormSchema = z.object({
  entity_type: customFieldEntityTypeSchema,
  name: requiredString.max(255, 'Field name must be 255 characters or less'),
  slug: requiredString.max(255, 'Slug must be 255 characters or less'),
  field_type: customFieldTypeSchema,
  options: z.array(z.unknown()).optional(),
  is_required: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type LeadSchema = z.infer<typeof leadSchema>;
export type CompanySchema = z.infer<typeof companySchema>;
export type ContactSchema = z.infer<typeof contactSchema>;
export type PipelineSchema = z.infer<typeof pipelineSchema>;
export type PipelineStageSchema = z.infer<typeof pipelineStageSchema>;
export type DealSchema = z.infer<typeof dealSchema>;
export type TaskSchema = z.infer<typeof taskSchema>;
export type NoteSchema = z.infer<typeof noteSchema>;
export type ActivitySchema = z.infer<typeof activitySchema>;
export type TagSchema = z.infer<typeof tagSchema>;
export type TagAssignmentSchema = z.infer<typeof tagAssignmentSchema>;
export type CustomFieldSchema = z.infer<typeof customFieldSchema>;
export type CustomFieldValueSchema = z.infer<typeof customFieldValueSchema>;

export type LeadFormSchema = z.infer<typeof leadFormSchema>;
export type CompanyFormSchema = z.infer<typeof companyFormSchema>;
export type ContactFormSchema = z.infer<typeof contactFormSchema>;
export type DealFormSchema = z.infer<typeof dealFormSchema>;
export type TaskFormSchema = z.infer<typeof taskFormSchema>;
export type NoteFormSchema = z.infer<typeof noteFormSchema>;
export type PipelineFormSchema = z.infer<typeof pipelineFormSchema>;
export type PipelineStageFormSchema = z.infer<typeof pipelineStageFormSchema>;
export type TagFormSchema = z.infer<typeof tagFormSchema>;
export type CustomFieldFormSchema = z.infer<typeof customFieldFormSchema>;
