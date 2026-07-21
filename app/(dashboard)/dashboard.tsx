import React from 'react';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { DashboardWidgets } from './widgets/DashboardWidgets';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';

const Dashboard = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dashboard data.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <main className="flex-1 p-4">
        <DashboardWidgets data={data} />
      </main>
    </div>
  );
};

export default Dashboard;