'use client';

import { useCallback, useEffect, useState } from 'react';
import { OrganizationService } from '@/services/organization';
import type { ActionResult } from '@/types/api';
import type { Organization, OrganizationContext, OrganizationMembership, OrganizationSettings, Profile } from '@/types/organization';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [activeMembership, setActiveMembership] = useState<OrganizationMembership | null>(null);
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyContext = useCallback((context: OrganizationContext) => {
    setOrganizations(context.organizations);
    setProfile(context.profile);
    setMemberships(context.memberships);
    setActiveOrganization(context.activeOrganization);
    setActiveMembership(context.activeMembership);
    setSettings(context.settings);
  }, []);

  const refreshOrganizations = useCallback(async () => {
    setLoading(true);

    const { data, error: organizationsError } = await OrganizationService.getOrganizationContext();

    if (organizationsError || !data) {
      setOrganizations([]);
      setProfile(null);
      setMemberships([]);
      setActiveOrganization(null);
      setActiveMembership(null);
      setSettings(null);
      setError(organizationsError);
      setLoading(false);
      return;
    }

    applyContext(data);
    setError(null);
    setLoading(false);
  }, [applyContext]);

  const setCurrentOrganization = useCallback(async (organizationId: string): Promise<ActionResult> => {
    setLoading(true);
    const { error: switchError } = await OrganizationService.switchActiveOrganization(organizationId);

    if (switchError) {
      setError(switchError);
      setLoading(false);
      return { error: switchError };
    }

    await refreshOrganizations();
    return { error: null };
  }, [refreshOrganizations]);

  useEffect(() => {
    void refreshOrganizations();
  }, [refreshOrganizations]);

  return {
    organizations,
    profile,
    memberships,
    activeOrganization,
    activeMembership,
    settings,
    loading,
    error,
    refreshOrganizations,
    setCurrentOrganization,
  };
}