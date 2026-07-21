import React from 'react';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const AnalyticsPage = () => {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load analytics data." />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <AnalyticsChart data={data} />
    </div>
  );
};

export default AnalyticsPage;