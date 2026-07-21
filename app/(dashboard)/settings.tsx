import React from 'react';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const SettingsPage = () => {
  const { settings, isLoading, error } = useSettings();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load settings." />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <SettingsForm initialValues={settings} />
    </div>
  );
};

export default SettingsPage;