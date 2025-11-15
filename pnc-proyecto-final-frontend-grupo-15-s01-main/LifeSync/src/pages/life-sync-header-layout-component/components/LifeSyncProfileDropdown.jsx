// src/pages/life-sync-header-layout-component/components/LifeSyncProfileDropdown.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LifeSyncProfileDropdown = ({ user = null, syncStatus = 'online', onLogout = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const defaultUser = {
    name: 'John Doe',
    email: 'john.doe@lifesync.com',
    avatar: null
  };

  const currentUser = user || defaultUser;

  const syncStatusConfig = {
    online: {
      icon: 'Wifi',
      label: 'Synced',
      className: 'lifesync-sync-status online'
    },
    offline: {
      icon: 'WifiOff',
      label: 'Offline',
      className: 'lifesync-sync-status offline'
    },
    syncing: {
      icon: 'RefreshCw',
      label: 'Syncing...',
      className: 'lifesync-sync-status syncing'
    }
  };

  const currentSyncStatus = syncStatusConfig[syncStatus] || syncStatusConfig.online;

  const menuItems = [
    {
      label: 'Profile Settings',
      icon: 'Settings',
      route: '/user-profile-settings',
      description: 'Manage your account'
    },
    {
      label: 'Sync Settings',
      icon: 'RefreshCw',
      route: '/sync-settings',
      description: 'Configure data sync'
    },
    {
      type: 'divider'
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      route: '/help',
      description: 'Get assistance'
    },
    {
      type: 'divider'
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      action: 'logout',
      description: 'Sign out of your account',
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      if (onLogout) {
        onLogout();
      } else {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } else if (item.route) {
      navigate(item.route);
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      ?.map(word => word?.charAt(0))
      ?.join('')
      ?.toUpperCase()
      ?.slice(0, 2) || 'JD';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Sync Status */}
      <div className="flex items-center space-x-2">
        <Icon 
          name={currentSyncStatus.icon} 
          size={16} 
          className={currentSyncStatus.className}
        />
        <span className="text-sm text-gray-600 hidden sm:inline">
          {currentSyncStatus.label}
        </span>
      </div>

      {/* Current Date */}
      <div className="hidden md:flex items-center text-sm text-gray-600">
        <Icon name="Calendar" size={16} className="mr-1" />
        {getCurrentDate()}
      </div>

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 group"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden lifesync-profile-avatar flex items-center justify-center">
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser?.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {getInitials(currentUser?.name)}
              </span>
            )}
          </div>

          {/* Dropdown Indicator */}
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`ml-2 text-gray-500 transition-all duration-200 group-hover:text-gray-700 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 lifesync-profile-dropdown rounded-xl z-1010 animation-fade-in overflow-hidden">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden lifesync-profile-avatar flex items-center justify-center">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-base font-medium">
                      {getInitials(currentUser?.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {currentUser?.email || 'user@lifesync.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 max-h-72 overflow-y-auto custom-scrollbar">
              {menuItems?.map((item, index) => {
                if (item?.type === 'divider') {
                  return (
                    <div 
                      key={index} 
                      className="my-1 border-t border-gray-100" 
                    />
                  );
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    className={`
                      w-full flex items-start px-4 py-2.5 text-left transition-all duration-200 ease-out
                      ${item?.className || 'text-gray-700 hover:bg-gray-50'}
                      focus:outline-none focus:bg-gray-50
                    `}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={16} 
                      className={`mr-3 mt-0.5 flex-shrink-0 ${
                        item?.action === 'logout' ? 'text-red-600' : 'text-gray-500'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {item?.label}
                      </div>
                      {item?.description && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifeSyncProfileDropdown;