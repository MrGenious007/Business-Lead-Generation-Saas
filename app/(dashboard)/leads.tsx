import React from 'react';
import { useLeads } from '@/features/leads/hooks/useLeads';
import LeadTable from '@/components/ui/LeadTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const LeadsPage = () => {
  const { leads, isLoading, isError } = useLeads();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error loading leads. Please try again later.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leads Management</h1>
      {leads.length === 0 ? (
        <EmptyState message="No leads found. Start adding leads!" />
      ) : (
        <LeadTable leads={leads} />
      )}
    </div>
  );
};

export default LeadsPage;