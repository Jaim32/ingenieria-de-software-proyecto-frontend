// src/pages/life-sync-header-layout-component/components/LifeSyncNavigation.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LifeSyncNavigation = ({ modules = [], isMobile = false, onItemClick = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleModuleClick = (module) => {
    if (onItemClick) {
      onItemClick(module);
    }
    navigate(module?.route || '/');
  };

  const isModuleActive = (module) => {
    return location?.pathname === module?.route || 
           (module?.route !== '/' && location?.pathname?.startsWith(module?.route));
  };

  if (isMobile) {
    return (
      <nav className="px-4 py-6 space-y-2">
        {navigationModules?.map((module) => (
          <button
            key={module?.id}
            onClick={() => handleModuleClick(module)}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-out
              lifesync-nav-item
              ${isModuleActive(module) ? 'active' : ''}
            `}
          >
            <Icon 
              name={module?.icon} 
              size={20} 
              className="mr-3" 
            />
            <span>{module?.label}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navigationModules?.map((module) => (
        <button
          key={module?.id}
          onClick={() => handleModuleClick(module)}
          className={`
            flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out
            lifesync-nav-item
            ${isModuleActive(module) ? 'active' : ''}
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
          `}
        >
          <Icon 
            name={module?.icon} 
            size={18} 
            className="mr-2" 
          />
          <span className="text-sm font-medium">{module?.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default LifeSyncNavigation;