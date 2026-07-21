'use client';

import { useCallback, useEffect, useState } from 'react';
import { getOrganizations } from '@/services/organization';
import type { Organization } from '@/types/organization';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrganizations = useCallback(async () => {
    setLoading(true);

    const { data, error: organizationsError } = await getOrganizations();

    if (organizationsError) {
      setOrganizations([]);
      setError(organizationsError);
      setLoading(false);
      return;
    }

    setOrganizations(data ?? []);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshOrganizations();
  }, [refreshOrganizations]);

  return { organizations, loading, error, refreshOrganizations };
}