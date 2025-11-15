import React, { useState, useEffect } from 'react';

import Icon from 'components/AppIcon';

import ContextualModal, { ConfirmationModal } from 'components/ui/ContextualModal';
import TasterManagement from './components/TasterManagement';
import PublicationsManagement from './components/PublicationsManagement';

const AdministrativeDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasters'); // For mobile responsive
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: '',
    data: null,
    title: '',
    message: ''
  });

  // Mock audit log for demonstration
  const [auditLog, setAuditLog] = useState([]);

  const logAction = (action, details) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date(),
      action,
      details,
      user: 'Admin User'
    };
    setAuditLog(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 entries
    console.log('Audit Log:', logEntry);
  };

  const handleConfirmAction = (type, data) => {
    let title = '';
    let message = '';

    switch (type) {
      case 'delete-taster':
        title = 'Delete Taster Account';
        message = `Are you sure you want to delete ${data.name}'s account? This action cannot be undone and will remove all associated data.`;
        break;
      case 'toggle-admin':
        title = data.isAdmin ? 'Remove Admin Privileges' : 'Grant Admin Privileges';
        message = data.isAdmin
          ? `Remove admin privileges from ${data.name}? They will lose access to administrative functions.`
          : `Grant admin privileges to ${data.name}? They will gain access to administrative functions.`;
        break;
      case 'delete-recipe':
        title = 'Delete Recipe';
        message = `Are you sure you want to delete "${data.title}"? This action cannot be undone and will remove the recipe from all user collections.`;
        break;
      default:
        return;
    }

    setConfirmationModal({
      isOpen: true,
      type,
      data,
      title,
      message
    });
  };

  const executeAction = () => {
    const { type, data } = confirmationModal;

    switch (type) {
      case 'delete-taster':
        logAction('DELETE_TASTER', `Deleted taster account: ${data.name} (${data.email})`);
        break;
      case 'toggle-admin': logAction('TOGGLE_ADMIN', `${data.isAdmin ? 'Removed' : 'Granted'} admin privileges for: ${data.name}`);
        break;
      case 'delete-recipe':
        logAction('DELETE_RECIPE', `Deleted recipe: ${data.title} by ${data.author}`);
        break;
    }

    setConfirmationModal({ isOpen: false, type: '', data: null, title: '', message: '' });
  };

  const closeConfirmation = () => {
    setConfirmationModal({ isOpen: false, type: '', data: null, title: '', message: '' });
  };

  return (
    <div className="theme-admin pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">Administrative Dashboard</h1>
          <p className="text-text-secondary">
            Manage taster accounts and recipe publications for the food tasting community
          </p>
        </div>

        {/* Desktop Dual-Pane Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 h-[calc(100vh-12rem)]">
          <div className="bg-surface rounded-lg shadow-base border border-border">
            <TasterManagement onConfirmAction={handleConfirmAction} />
          </div>
          <div className="bg-surface rounded-lg shadow-base border border-border">
            <PublicationsManagement onConfirmAction={handleConfirmAction} />
          </div>
        </div>

        {/* Tablet Stacked Layout */}
        <div className="hidden md:block lg:hidden space-y-6">
          <div className="bg-surface rounded-lg shadow-base border border-border h-96">
            <TasterManagement onConfirmAction={handleConfirmAction} />
          </div>
          <div className="bg-surface rounded-lg shadow-base border border-border h-96">
            <PublicationsManagement onConfirmAction={handleConfirmAction} />
          </div>
        </div>

        {/* Mobile Tabbed Layout */}
        <div className="md:hidden">
          <div className="bg-surface rounded-lg shadow-base border border-border">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('tasters')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${activeTab === 'tasters' ? 'text-primary border-b-2 border-primary bg-primary-50' : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>Tasters</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${activeTab === 'publications' ? 'text-primary border-b-2 border-primary bg-primary-50' : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="BookOpen" size={16} />
                  <span>Publications</span>
                </div>
              </button>
            </div>

            <div className="h-[calc(100vh-16rem)]">
              {activeTab === 'tasters' ? (
                <TasterManagement onConfirmAction={handleConfirmAction} />
              ) : (
                <PublicationsManagement onConfirmAction={handleConfirmAction} />
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmation}
          onConfirm={executeAction}
          title={confirmationModal.title}
          message={confirmationModal.message}
          variant={confirmationModal.type.includes('delete') ? 'error' : 'warning'}
          confirmText={confirmationModal.type.includes('delete') ? 'Delete' : 'Confirm'}
        />
      </div>
    </div>
  );
};

export default AdministrativeDashboard;