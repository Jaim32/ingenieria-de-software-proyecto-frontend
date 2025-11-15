import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="bg-surface border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary font-heading mb-1">
          Recipe Moderation
        </h1>
        <p className="text-text-secondary text-sm">
          Review and approve user-submitted recipes to maintain quality standards across the wellness platform
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;