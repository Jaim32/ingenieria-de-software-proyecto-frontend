import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const EcosystemNavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const modules = [
    {
      label: 'Food Control',
      path: '/administrative-dashboard',
      icon: 'ChefHat',
      tooltip: 'Manage food tasting community and recipes'
    },
    {
      label: 'Ideal Sleep',
      path: '/ideal-sleep',
      icon: 'Moon',
      tooltip: 'Sleep tracking and optimization'
    },
    {
      label: 'HydroTrack',
      path: '/hydro-track',
      icon: 'Droplets',
      tooltip: 'Water intake monitoring'
    },
    {
      label: 'Consults',
      path: '/consults',
      icon: 'MessageSquare',
      tooltip: 'Consultation management'
    }
  ];

  const isActiveModule = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 hover-lift">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Utensils" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">AdminHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {modules.map((module) => (
              <div key={module.path} className="relative group">
                <Link
                  to={module.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 hover:scale-[1.02] ${
                    isActiveModule(module.path)
                      ? 'bg-primary text-white shadow-base'
                      : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  <Icon name={module.icon} size={18} />
                  <span>{module.label}</span>
                </Link>
                
                {/* Tooltip */}
                <div className="tooltip group-hover:opacity-100 -bottom-8 left-1/2 transform -translate-x-1/2">
                  {module.tooltip}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-all duration-150"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {modules.map((module) => (
                <Link
                  key={module.path}
                  to={module.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-150 ${
                    isActiveModule(module.path)
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  <Icon name={module.icon} size={20} />
                  <div>
                    <div>{module.label}</div>
                    <div className="text-xs opacity-75">{module.tooltip}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EcosystemNavigationBar;