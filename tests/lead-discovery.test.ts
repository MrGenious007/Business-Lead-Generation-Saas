import { saveBusiness, searchBusinesses } from '@/services/lead-discovery/google-places';

describe('lead discovery service', () => {
  it('returns a search payload shape', async () => {
    const result = await searchBusinesses({ keyword: 'dentist', industry: 'Healthcare', city: 'Chicago', state: 'IL', country: 'US', radius: 10, page: 1, pageSize: 1 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('error');
  });

  it('accepts a business payload for save', async () => {
    const result = await saveBusiness({ business_name: 'Test Clinic', category: 'Healthcare', address: 'Chicago, IL' });
    expect(result).toHaveProperty('error');
  });
});
