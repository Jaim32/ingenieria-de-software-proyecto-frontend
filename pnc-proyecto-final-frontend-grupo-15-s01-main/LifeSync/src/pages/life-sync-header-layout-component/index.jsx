// src/pages/life-sync-header-layout-component/index.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LifeSyncNavigation from './components/LifeSyncNavigation';
import LifeSyncProfileDropdown from './components/LifeSyncProfileDropdown';

// Import the themes CSS
import '../../styles/themes.css';

const LifeSyncHeaderLayout = ({ children, user = null, modules = [], onLogout = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('online');
  const location = useLocation();

  // Mock sync status changes (in real app, this would come from your sync service)
  useEffect(() => {
    const syncStates = ['online', 'syncing', 'online'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setSyncStatus(syncStates[currentIndex]);
      currentIndex = (currentIndex + 1) % syncStates.length;
    }, 10000); // Change every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  const handleMobileNavClick = (module) => {
    setIsMobileMenuOpen(false);
  };

  const defaultModules = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'BarChart3',
      route: '/dashboard'
    },
    {
      id: 'health-track',
      label: 'Health Track',
      icon: 'Heart',
      route: '/health-track'
    },
    {
      id: 'life-sync',
      label: 'Life Sync',
      icon: 'Zap',
      route: '/life-sync'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: 'TrendingUp',
      route: '/insights'
    }
  ];

  const navigationModules = modules?.length > 0 ? modules : defaultModules;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 lifesync-header z-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lifesync-brand-accent rounded-xl flex items-center justify-center shadow-sm">
                    <Icon name="Zap" size={24} color="white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-xl lifesync-brand">
                      LifeSync
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Sync Your Life
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <LifeSyncNavigation 
              modules={navigationModules}
              isMobile={false}
            />

            {/* Profile Section */}
            <LifeSyncProfileDropdown 
              user={user}
              syncStatus={syncStatus}
              onLogout={onLogout}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white border-t border-gray-200 z-1010 animation-slide-up">
            <LifeSyncNavigation 
              modules={navigationModules}
              isMobile={true}
              onItemClick={handleMobileNavClick}
            />
            
            {/* Mobile Profile Section */}
            <div className="px-4 py-4 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden lifesync-profile-avatar flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user?.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user?.name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2) || 'JD'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || 'John Doe'}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email || 'john.doe@lifesync.com'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                    syncStatus === 'online' ? 'bg-green-100' :
                    syncStatus === 'syncing' ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <Icon 
                      name={syncStatus === 'online' ? 'Wifi' : syncStatus === 'syncing' ? 'RefreshCw' : 'WifiOff'} 
                      size={12} 
                      className={`${
                        syncStatus === 'online' ? 'text-green-600' :
                        syncStatus === 'syncing' ? 'text-orange-600 animate-spin' : 'text-red-600'
                      }`}
                    />
                    <span className={`text-xs font-medium ${
                      syncStatus === 'online' ? 'text-green-700' :
                      syncStatus === 'syncing' ? 'text-orange-700' : 'text-red-700'
                    }`}>
                      {syncStatus === 'online' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Click outside handler for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-999" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default LifeSyncHeaderLayout;