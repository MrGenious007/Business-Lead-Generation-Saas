import React from 'react';
import { useCompanies } from '@/features/companies/hooks/useCompanies';
import CompanyCard from '@/components/ui/CompanyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const CompaniesPage = () => {
  const { companies, isLoading, isError } = useCompanies();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error loading companies.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      {companies.length === 0 ? (
        <EmptyState message="No companies found." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;