import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const Integrations = ({ onSave }) => {
  const [integrations, setIntegrations] = useState({
    connectedServices: [
      {
        id: 'fitbit',
        name: 'Fitbit',
        description: 'Sync your fitness and sleep data',
        icon: 'Activity',
        connected: true,
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        status: 'active',
        permissions: ['steps', 'heart_rate', 'sleep', 'weight']
      },
      {
        id: 'apple-health',
        name: 'Apple Health',
        description: 'Import health data from Apple Health app',
        icon: 'Heart',
        connected: true,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'active',
        permissions: ['nutrition', 'workouts', 'vitals']
      },
      {
        id: 'google-fit',
        name: 'Google Fit',
        description: 'Connect with Google Fit for activity tracking',
        icon: 'Smartphone',
        connected: false,
        lastSync: null,
        status: 'disconnected',
        permissions: []
      }
    ],
    availableServices: [
      {
        id: 'myfitnesspal',
        name: 'MyFitnessPal',
        description: 'Import nutrition and calorie data',
        icon: 'Utensils',
        category: 'nutrition'
      },
      {
        id: 'strava',
        name: 'Strava',
        description: 'Sync your running and cycling activities',
        icon: 'MapPin',
        category: 'fitness'
      },
      {
        id: 'withings',
        name: 'Withings',
        description: 'Connect smart scales and health devices',
        icon: 'Scale',
        category: 'health'
      },
      {
        id: 'garmin',
        name: 'Garmin',
        description: 'Sync data from Garmin devices',
        icon: 'Watch',
        category: 'fitness'
      },
      {
        id: 'sleep-cycle',
        name: 'Sleep Cycle',
        description: 'Import detailed sleep analysis',
        icon: 'Moon',
        category: 'sleep'
      },
      {
        id: 'cronometer',
        name: 'Cronometer',
        description: 'Track detailed nutrition information',
        icon: 'BarChart3',
        category: 'nutrition'
      }
    ],
    syncSettings: {
      autoSync: true,
      syncFrequency: 'hourly',
      dataRetention: 365,
      conflictResolution: 'latest'
    }
  });

  const [selectedService, setSelectedService] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleConnect = (service) => {
    setSelectedService(service);
    setShowConnectionModal(true);
  };

  const handleDisconnect = (serviceId) => {
    const confirmed = window.confirm(
      'Are you sure you want to disconnect this service? Historical data will be preserved, but new data will not be synced.'
    );
    
    if (confirmed) {
      setIntegrations(prev => ({
        ...prev,
        connectedServices: prev.connectedServices.map(service =>
          service.id === serviceId
            ? { ...service, connected: false, status: 'disconnected', lastSync: null, permissions: [] }
            : service
        )
      }));
    }
  };

  const handleReconnect = (serviceId) => {
    setIntegrations(prev => ({
      ...prev,
      connectedServices: prev.connectedServices.map(service =>
        service.id === serviceId
          ? { 
              ...service, 
              connected: true, 
              status: 'active', 
              lastSync: new Date(),
              permissions: service.id === 'fitbit' ? ['steps', 'heart_rate', 'sleep', 'weight'] : ['nutrition', 'workouts', 'vitals']
            }
          : service
      )
    }));
  };

  const handleSyncNow = (serviceId) => {
    setIntegrations(prev => ({
      ...prev,
      connectedServices: prev.connectedServices.map(service =>
        service.id === serviceId
          ? { ...service, lastSync: new Date(), status: 'syncing' }
          : service
      )
    }));

    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        connectedServices: prev.connectedServices.map(service =>
          service.id === serviceId
            ? { ...service, status: 'active' }
            : service
        )
      }));
    }, 2000);
  };

  const handleConnectService = () => {
    if (selectedService) {
      const newService = {
        ...selectedService,
        connected: true,
        lastSync: new Date(),
        status: 'active',
        permissions: ['basic_data']
      };

      setIntegrations(prev => ({
        ...prev,
        connectedServices: [...prev.connectedServices, newService],
        availableServices: prev.availableServices.filter(service => service.id !== selectedService.id)
      }));

      setShowConnectionModal(false);
      setSelectedService(null);
    }
  };

  const handleSyncSettingsChange = (field, value) => {
    setIntegrations(prev => ({
      ...prev,
      syncSettings: {
        ...prev.syncSettings,
        [field]: value
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success-600 bg-success-50';
      case 'syncing':
        return 'text-warning-600 bg-warning-50';
      case 'error':
        return 'text-error-600 bg-error-50';
      case 'disconnected':
        return 'text-text-secondary bg-gray-50';
      default:
        return 'text-text-secondary bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'syncing':
        return 'Loader2';
      case 'error':
        return 'AlertCircle';
      case 'disconnected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleSave = () => {
    onSave(integrations);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Integrations</h2>
          <p className="text-text-secondary">Connect third-party services and manage data synchronization</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save Settings
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Connected Services */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Connected Services</h3>
          <div className="space-y-4">
            {integrations.connectedServices.map((service) => (
              <div key={service.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Icon name={service.icon} size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{service.name}</h4>
                      <p className="text-sm text-text-secondary">{service.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          <Icon 
                            name={getStatusIcon(service.status)} 
                            size={12} 
                            className={`mr-1 ${service.status === 'syncing' ? 'animate-spin' : ''}`}
                          />
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </div>
                        <span className="text-xs text-text-secondary">
                          Last sync: {formatLastSync(service.lastSync)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.connected ? (
                      <>
                        <button
                          onClick={() => handleSyncNow(service.id)}
                          disabled={service.status === 'syncing'}
                          className="px-3 py-1 text-sm bg-secondary-50 text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Icon name="RefreshCw" size={14} className={`mr-1 ${service.status === 'syncing' ? 'animate-spin' : ''}`} />
                          Sync
                        </button>
                        <button
                          onClick={() => handleDisconnect(service.id)}
                          className="px-3 py-1 text-sm bg-error-50 text-error-600 rounded-lg hover:bg-error-100 transition-colors duration-200"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReconnect(service.id)}
                        className="px-3 py-1 text-sm bg-success-50 text-success-600 rounded-lg hover:bg-success-100 transition-colors duration-200"
                      >
                        Reconnect
                      </button>
                    )}
                  </div>
                </div>
                
                {service.connected && service.permissions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <p className="text-sm font-medium text-text-primary mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.permissions.map((permission) => (
                        <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Available Services */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.availableServices.map((service) => (
              <div key={service.id} className="card p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon name={service.icon} size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{service.name}</h4>
                      <p className="text-sm text-text-secondary">{service.description}</p>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1 capitalize">
                        {service.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect(service)}
                    className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Settings */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Sync Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-text-primary">Auto Sync</span>
                <p className="text-sm text-text-secondary">Automatically sync data from connected services</p>
              </div>
              <input
                type="checkbox"
                checked={integrations.syncSettings.autoSync}
                onChange={(e) => handleSyncSettingsChange('autoSync', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Sync Frequency</label>
              <select
                value={integrations.syncSettings.syncFrequency}
                onChange={(e) => handleSyncSettingsChange('syncFrequency', e.target.value)}
                disabled={!isEditing || !integrations.syncSettings.autoSync}
                className="input-field max-w-xs"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Every hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Data Retention (days)</label>
              <select
                value={integrations.syncSettings.dataRetention}
                onChange={(e) => handleSyncSettingsChange('dataRetention', parseInt(e.target.value))}
                disabled={!isEditing}
                className="input-field max-w-xs"
              >
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
                <option value={365}>1 year</option>
                <option value={730}>2 years</option>
                <option value={-1}>Forever</option>
              </select>
              <p className="text-sm text-text-secondary mt-1">
                How long to keep synced data in your account
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Conflict Resolution</label>
              <select
                value={integrations.syncSettings.conflictResolution}
                onChange={(e) => handleSyncSettingsChange('conflictResolution', e.target.value)}
                disabled={!isEditing}
                className="input-field max-w-xs"
              >
                <option value="latest">Use latest data</option>
                <option value="manual">Manual review</option>
                <option value="source-priority">Prioritize by source</option>
              </select>
              <p className="text-sm text-text-secondary mt-1">
                How to handle conflicting data from multiple sources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Icon name={selectedService.icon} size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Connect {selectedService.name}</h3>
                <p className="text-sm text-text-secondary">{selectedService.description}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-3">
                By connecting {selectedService.name}, you agree to share the following data:
              </p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Basic profile information</li>
                <li>• Activity and fitness data</li>
                <li>• Health metrics and measurements</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  setSelectedService(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectService}
                className="flex-1 btn-primary"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;