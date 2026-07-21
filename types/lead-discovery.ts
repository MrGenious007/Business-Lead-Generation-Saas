export interface BusinessSearchInput {
  keyword: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  radius?: number;
  page?: number;
  pageSize?: number;
}

export interface BusinessRecord {
  id?: string;
  business_name: string;
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  rating?: number;
  website?: string;
  phone?: string;
}

export interface SearchHistoryItem extends BusinessSearchInput {
  id: string;
  createdAt: string;
}
