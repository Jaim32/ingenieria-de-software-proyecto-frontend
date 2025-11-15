import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigationContainer = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigationTabs = [
    {
      id: 'assessment',
      label: 'Assessment',
      path: '/question-flow-interface',
      icon: 'Leaf',
      tooltip: 'Complete wellness questionnaire'
    },
    {
      id: 'results',
      label: 'Results',
      path: '/results-summary-screen',
      icon: 'CheckCircle',
      tooltip: 'View assessment results and recommendations'
    },
    {
      id: 'components',
      label: 'Components',
      path: '/component-library-preview',
      icon: 'Code',
      tooltip: 'Browse component library for developers'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentTab = navigationTabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
    setIsDropdownOpen(false);
  };

  const activeTabData = navigationTabs.find(tab => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-surface border-b border-secondary-200 sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex space-x-8">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all duration-150 ease-out
                    ${activeTab === tab.id
                      ? 'border-primary text-primary bg-primary-50' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-200'
                    }
                  `}
                  title={tab.tooltip}
                  aria-label={tab.tooltip}
                >
                  <Icon 
                    name={tab.icon} 
                    size={18} 
                    className="mr-2" 
                    color={activeTab === tab.id ? '#22C55E' : 'currentColor'}
                  />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-surface border-b border-secondary-200 sticky top-0 z-100">
        <div className="px-4 py-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-wellness border border-secondary-200 text-text-primary"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center">
                {activeTabData && (
                  <>
                    <Icon 
                      name={activeTabData.icon} 
                      size={18} 
                      className="mr-2" 
                      color="#22C55E"
                    />
                    <span className="font-medium">{activeTabData.label}</span>
                  </>
                )}
              </div>
              <Icon 
                name={isDropdownOpen ? 'ChevronUp' : 'ChevronDown'} 
                size={18} 
                className="text-text-secondary"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-secondary-200 rounded-wellness shadow-wellness-lg z-200">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`
                      w-full flex items-center px-4 py-3 text-left text-sm transition-colors duration-150
                      ${activeTab === tab.id
                        ? 'bg-primary-50 text-primary font-medium' :'text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
                      }
                      ${tab.id === navigationTabs[0].id ? 'rounded-t-wellness' : ''}
                      ${tab.id === navigationTabs[navigationTabs.length - 1].id ? 'rounded-b-wellness' : ''}
                    `}
                  >
                    <Icon 
                      name={tab.icon} 
                      size={18} 
                      className="mr-3" 
                      color={activeTab === tab.id ? '#22C55E' : 'currentColor'}
                    />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-text-secondary mt-1">{tab.tooltip}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="min-h-screen bg-background">
        {children}
      </main>
    </div>
  );
};

export default TabNavigationContainer;