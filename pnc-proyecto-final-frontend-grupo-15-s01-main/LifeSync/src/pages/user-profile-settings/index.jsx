import React, { useState } from 'react';
import Icon from 'components/AppIcon';

import PersonalInformation from './components/PersonalInformation';
import Preferences from './components/Preferences';
import PrivacySecurity from './components/PrivacySecurity';
import Integrations from './components/Integrations';

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [saveStatus, setSaveStatus] = useState(null);

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: 'User',
      description: 'Basic profile data and contact details'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      description: 'Dietary restrictions and module customizations'
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: 'Shield',
      description: 'Password, authentication, and data controls'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'Link',
      description: 'Connected services and third-party apps'
    }
  ];

  const handleSave = async (tabId, data) => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      console.log(`Saved ${tabId} data:`, data);
      
      // Clear save status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInformation onSave={(data) => handleSave('personal', data)} />;
      case 'preferences':
        return <Preferences onSave={(data) => handleSave('preferences', data)} />;
      case 'privacy':
        return <PrivacySecurity onSave={(data) => handleSave('privacy', data)} />;
      case 'integrations':
        return <Integrations onSave={(data) => handleSave('integrations', data)} />;
      default:
        return <PersonalInformation onSave={(data) => handleSave('personal', data)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Profile Settings</h1>
              <p className="text-text-secondary">Manage your account and personalization preferences</p>
            </div>
          </div>

          {/* Save Status Indicator */}
          {saveStatus && (
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              saveStatus === 'saving' ?'bg-warning-50 text-warning-700' :'bg-success-50 text-success-700'
            }`}>
              <Icon 
                name={saveStatus === 'saving' ? 'Loader2' : 'CheckCircle'} 
                size={16} 
                className={`mr-2 ${saveStatus === 'saving' ? 'animate-spin' : ''}`}
              />
              {saveStatus === 'saving' ? 'Saving changes...' : 'Changes saved successfully'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start p-4 rounded-lg text-left transition-all duration-200 ease-out ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' :'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                    }`}
                  >
                    <Icon 
                      name={tab.icon} 
                      size={20} 
                      className={`mr-3 mt-0.5 flex-shrink-0 ${
                        activeTab === tab.id ? 'text-primary-600' : 'text-text-secondary'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs text-text-secondary mt-1">{tab.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden col-span-1 mb-6">
            <div className="card p-4">
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white' :'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    <Icon 
                      name={tab.icon} 
                      size={16} 
                      className="mr-2"
                    />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="card">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;