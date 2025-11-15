import React, { useState } from 'react';
import Icon from '../AppIcon';

const BottomTabNavigation = () => {
  const [activeTab, setActiveTab] = useState('ideal-sleep');

  const tabs = [
    {
      id: 'food-control',
      label: 'Food Control',
      icon: 'Utensils',
      path: '/food-control'
    },
    {
      id: 'ideal-sleep',
      label: 'Ideal Sleep',
      icon: 'Moon',
      path: '/sleep-cycle-calculator-dashboard'
    },
    {
      id: 'hydro-track',
      label: 'HydroTrack',
      icon: 'Droplets',
      path: '/hydro-track'
    },
    {
      id: 'consults',
      label: 'Consults',
      icon: 'MessageCircle',
      path: '/consults'
    }
  ];

  const handleTabClick = (tabId, path) => {
    setActiveTab(tabId);
    // Navigation logic would go here
    // For now, we'll just update the active state
    console.log(`Navigating to: ${path}`);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={`
              flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1
              transition-smooth hover:scale-105 active:scale-95
              ${activeTab === tab.id 
                ? 'text-primary' :'text-text-secondary hover:text-text-primary'
              }
            `}
            aria-label={tab.label}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <div className={`
              p-1.5 rounded-lg transition-smooth
              ${activeTab === tab.id 
                ? 'bg-primary/10 text-primary' :'text-text-secondary group-hover:text-text-primary'
              }
            `}>
              <Icon 
                name={tab.icon} 
                size={20} 
                strokeWidth={activeTab === tab.id ? 2.5 : 2}
              />
            </div>
            <span className={`
              text-xs font-medium mt-1 truncate max-w-full
              transition-smooth
              ${activeTab === tab.id 
                ? 'text-primary font-semibold' :'text-text-secondary'
              }
            `}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;