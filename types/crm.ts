export interface Lead {
  id?: string;
  organization_id?: string | null;
  company_id?: string | null;
  owner_id?: string | null;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Company {
  id?: string;
  organization_id?: string | null;
  name: string;
  website?: string | null;
  industry?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id?: string;
  organization_id?: string | null;
  company_id?: string | null;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id?: string;
  organization_id?: string | null;
  company_id?: string | null;
  contact_id?: string | null;
  owner_id?: string | null;
  title: string;
  amount?: number | null;
  stage?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Pipeline {
  id?: string;
  organization_id?: string | null;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskItem {
  id?: string;
  organization_id?: string | null;
  owner_id?: string | null;
  title: string;
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NoteItem {
  id?: string;
  organization_id?: string | null;
  entity_type: 'lead' | 'company' | 'deal' | 'contact';
  entity_id?: string | null;
  content: string;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  details?: string | null;
  created_at?: string;
}

export type LeadCreateInput = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
export type CompanyCreateInput = Omit<Company, 'id' | 'created_at' | 'updated_at' | 'status'>;
export type DealCreateInput = Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'status'>;
export type TaskCreateInput = Omit<TaskItem, 'id' | 'created_at' | 'updated_at'>;
export type NoteCreateInput = Omit<NoteItem, 'id' | 'created_at' | 'updated_at'>;
