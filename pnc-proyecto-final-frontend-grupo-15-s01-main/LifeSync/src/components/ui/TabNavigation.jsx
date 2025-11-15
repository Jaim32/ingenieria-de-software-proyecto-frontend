import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function TabNavigation() {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Discover',
      path: '/community-recipe-browse',
      icon: 'Search',
      activePattern: '/community-recipe-browse'
    },
    {
      label: 'Create',
      path: '/recipe-creation-form',
      icon: 'Plus',
      activePattern: '/recipe-creation-form'
    }
  ];

  const isActiveTab = (activePattern) => {
    return location.pathname === activePattern;
  };

  return (
    <nav className="sticky top-16 bg-background border-b border-border-color z-dropdown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center md:justify-start space-x-1 md:space-x-4 py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-body font-body-medium transition-smooth min-w-0 flex-1 md:flex-initial justify-center md:justify-start ${
                isActiveTab(item.activePattern)
                  ? 'bg-primary text-white shadow-card'
                  : 'text-text-primary hover:bg-surface hover:text-primary'
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default TabNavigation;