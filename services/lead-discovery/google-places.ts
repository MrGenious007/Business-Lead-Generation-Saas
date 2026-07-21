import type { BusinessRecord, BusinessSearchInput, SearchHistoryItem } from '@/types/lead-discovery';

const searchHistory: SearchHistoryItem[] = [];

function buildBusinessRecord(input: BusinessSearchInput, index: number): BusinessRecord {
  return {
    id: `${input.keyword}-${index + 1}`,
    business_name: `${input.keyword} Prospect ${index + 1}`,
    category: input.industry ?? 'General',
    address: [input.city, input.state, input.country].filter(Boolean).join(', ') || 'Location pending',
    city: input.city,
    state: input.state,
    country: input.country,
    rating: Number((4 + (index % 5) * 0.1).toFixed(1)),
    website: `https://${input.keyword.replace(/\s+/g, '').toLowerCase()}${index + 1}.example.com`,
    phone: '+1 (555) 010-0000',
  };
}

export async function searchBusinesses(input: BusinessSearchInput) {
  if (!input.keyword.trim()) {
    return { data: [] as BusinessRecord[], error: 'Keyword is required.', history: null as SearchHistoryItem | null };
  }

  const pageSize = Math.max(input.pageSize ?? 10, 1);
  const historyEntry: SearchHistoryItem = {
    ...input,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  searchHistory.unshift(historyEntry);

  const data = Array.from({ length: pageSize }, (_, index) => buildBusinessRecord(input, index));
  return { data, error: null, history: historyEntry };
}

export async function saveBusiness(business: BusinessRecord) {
  if (!business.business_name.trim()) {
    return { data: null as BusinessRecord | null, error: 'Business name is required.' };
  }

  return {
    data: {
      ...business,
      id: business.id ?? `saved-${Date.now()}`,
    },
    error: null,
  };
}

export async function getSearchHistory() {
  return { data: searchHistory, error: null };
}
