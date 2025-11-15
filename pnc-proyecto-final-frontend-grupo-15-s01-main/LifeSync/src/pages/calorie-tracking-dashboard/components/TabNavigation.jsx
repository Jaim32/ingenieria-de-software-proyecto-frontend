// src/pages/calorie-tracking-dashboard/components/TabNavigation.jsx
import React from 'react';
import PropTypes from 'prop-types';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'food', label: 'Food Control', icon: '🍽️' },
    { id: 'sleep', label: 'Ideal Sleep', icon: '💤' },
    { id: 'hydration', label: 'HydroTrack', icon: '💧' },
    { id: 'consults', label: 'Consults', icon: '👨‍⚕️' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id
                ? 'border-orange-500 text-orange-600 bg-orange-50' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default TabNavigation;