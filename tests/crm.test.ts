import {
  activityCreateSchema,
  companyFormSchema,
  customFieldCreateSchema,
  dealFormSchema,
  leadFormSchema,
  noteFormSchema,
  pipelineStageFormSchema,
  tagAssignmentCreateSchema,
  taskFormSchema,
} from '@/lib/validators/crm';

describe('CRM form validation', () => {
  it('validates a complete lead form', () => {
    const result = leadFormSchema.safeParse({
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1 555 1234',
      company_name: 'Acme Inc',
      notes: 'Interested in enterprise plan',
      status: 'new',
      source: 'website',
    });
    expect(result.success).toBe(true);
  });

  it('requires a full name for leads', () => {
    const result = leadFormSchema.safeParse({ email: 'jane@example.com' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('full_name');
    }
  });

  it('rejects invalid lead email addresses', () => {
    const result = leadFormSchema.safeParse({ full_name: 'Jane Doe', email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('validates a company form with defaults', () => {
    const result = companyFormSchema.safeParse({ name: 'Acme Inc' });
    expect(result.success).toBe(true);
  });

  it('validates a deal form with amount and stage', () => {
    const result = dealFormSchema.safeParse({
      title: 'Enterprise subscription',
      amount: 12000,
      stage: 'proposal',
      status: 'open',
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative deal amounts', () => {
    const result = dealFormSchema.safeParse({ title: 'Bad deal', amount: -100 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('amount');
    }
  });

  it('rejects unknown deal stages', () => {
    const result = dealFormSchema.safeParse({ title: 'Deal', stage: 'invalid_stage' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('stage');
    }
  });

  it('validates a task form', () => {
    const result = taskFormSchema.safeParse({
      title: 'Follow up',
      due_date: '2026-08-01',
      priority: 'high',
      status: 'todo',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid task priorities', () => {
    const result = taskFormSchema.safeParse({ title: 'Task', priority: 'urgent' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('priority');
    }
  });

  it('validates a note form', () => {
    const result = noteFormSchema.safeParse({
      content: 'Called the prospect',
      entity_type: 'lead',
      entity_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('requires note content', () => {
    const result = noteFormSchema.safeParse({ entity_type: 'deal' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('content');
    }
  });

  it('rejects invalid note entity types', () => {
    const result = noteFormSchema.safeParse({ content: 'Note', entity_type: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('entity_type');
    }
  });

  it('validates pipeline stage probability range', () => {
    const valid = pipelineStageFormSchema.safeParse({
      pipeline_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Qualified',
      position: 1,
      probability: 50,
    });
    expect(valid.success).toBe(true);

    const tooHigh = pipelineStageFormSchema.safeParse({
      pipeline_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Qualified',
      position: 1,
      probability: 150,
    });
    expect(tooHigh.success).toBe(false);
  });

  it('prevents a stage from being both closed won and closed lost', () => {
    const result = pipelineStageFormSchema.safeParse({
      pipeline_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Closed',
      position: 5,
      is_closed_won: true,
      is_closed_lost: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('CRM create schemas', () => {
  it('validates a custom field create payload', () => {
    const result = customFieldCreateSchema.safeParse({
      organization_id: '550e8400-e29b-41d4-a716-446655440000',
      entity_type: 'deal',
      name: 'Contract Value',
      slug: 'contract_value',
      field_type: 'number',
      options: [],
      is_required: true,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects unsupported custom field types', () => {
    const result = customFieldCreateSchema.safeParse({
      organization_id: '550e8400-e29b-41d4-a716-446655440000',
      entity_type: 'deal',
      name: 'Field',
      slug: 'field',
      field_type: 'unsupported',
    });
    expect(result.success).toBe(false);
  });

  it('validates an activity create payload', () => {
    const result = activityCreateSchema.safeParse({
      organization_id: '550e8400-e29b-41d4-a716-446655440000',
      entity_type: 'lead',
      entity_id: '550e8400-e29b-41d4-a716-446655440000',
      action: 'Created lead',
      action_type: 'user',
      metadata: { source: 'crm' },
    });
    expect(result.success).toBe(true);
  });

  it('validates a tag assignment create payload', () => {
    const result = tagAssignmentCreateSchema.safeParse({
      organization_id: '550e8400-e29b-41d4-a716-446655440000',
      tag_id: '550e8400-e29b-41d4-a716-446655440000',
      entity_type: 'deal',
      entity_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });
});
