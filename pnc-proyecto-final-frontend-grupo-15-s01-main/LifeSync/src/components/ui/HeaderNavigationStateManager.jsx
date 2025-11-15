import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Navigation State Context
const NavigationStateContext = createContext();

// Action Types
const NAVIGATION_ACTIONS = {
  SET_ACTIVE_MODULE: 'SET_ACTIVE_MODULE',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_NAVIGATION_PREFERENCES: 'SET_NAVIGATION_PREFERENCES',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  SET_MOBILE_MENU_OPEN: 'SET_MOBILE_MENU_OPEN',
  SET_ACCOUNT_DROPDOWN_OPEN: 'SET_ACCOUNT_DROPDOWN_OPEN',
  RESET_NAVIGATION_STATE: 'RESET_NAVIGATION_STATE'
};

// Initial State
const initialState = {
  activeModule: null,
  userProfile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    preferences: {
      theme: 'light',
      notifications: true,
      compactMode: false
    }
  },
  navigationPreferences: {
    sidebarCollapsed: false,
    favoriteModules: [],
    recentlyAccessed: []
  },
  ui: {
    isMobileMenuOpen: false,
    isAccountDropdownOpen: false,
    isLoading: false,
    loadingMessage: ''
  },
  modules: [
    {
      id: 'food-control',
      label: 'Food Control',
      icon: 'Utensils',
      colorTheme: 'primary',
      route: '/food-control',
      isEnabled: true,
      lastAccessed: null
    },
    {
      id: 'ideal-sleep',
      label: 'Ideal Sleep',
      icon: 'Moon',
      colorTheme: 'secondary',
      route: '/ideal-sleep',
      isEnabled: true,
      lastAccessed: null
    },
    {
      id: 'hydro-track',
      label: 'HydroTrack',
      icon: 'Droplets',
      colorTheme: 'secondary',
      route: '/hydro-track',
      isEnabled: true,
      lastAccessed: null
    },
    {
      id: 'consults',
      label: 'Consults',
      icon: 'MessageCircle',
      colorTheme: 'success',
      route: '/consults',
      isEnabled: true,
      lastAccessed: null
    }
  ]
};

// Reducer Function
const navigationReducer = (state, action) => {
  switch (action.type) {
    case NAVIGATION_ACTIONS.SET_ACTIVE_MODULE:
      return {
        ...state,
        activeModule: action.payload,
        modules: state.modules.map(module => 
          module.id === action.payload?.id 
            ? { ...module, lastAccessed: new Date().toISOString() }
            : module
        )
      };

    case NAVIGATION_ACTIONS.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload
        }
      };

    case NAVIGATION_ACTIONS.SET_NAVIGATION_PREFERENCES:
      return {
        ...state,
        navigationPreferences: {
          ...state.navigationPreferences,
          ...action.payload
        }
      };

    case NAVIGATION_ACTIONS.SET_LOADING_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload.isLoading,
          loadingMessage: action.payload.message || ''
        }
      };

    case NAVIGATION_ACTIONS.SET_MOBILE_MENU_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          isMobileMenuOpen: action.payload,
          // Close account dropdown when mobile menu opens
          isAccountDropdownOpen: action.payload ? false : state.ui.isAccountDropdownOpen
        }
      };

    case NAVIGATION_ACTIONS.SET_ACCOUNT_DROPDOWN_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          isAccountDropdownOpen: action.payload,
          // Close mobile menu when account dropdown opens
          isMobileMenuOpen: action.payload ? false : state.ui.isMobileMenuOpen
        }
      };

    case NAVIGATION_ACTIONS.RESET_NAVIGATION_STATE:
      return {
        ...initialState,
        userProfile: state.userProfile // Preserve user profile on reset
      };

    default:
      return state;
  }
};

// Navigation State Provider Component
export const NavigationStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);
  const location = useLocation();

  // Auto-detect active module based on current route
  useEffect(() => {
    const currentModule = state.modules.find(module => 
      location.pathname.startsWith(module.route)
    );
    
    if (currentModule && currentModule.id !== state.activeModule?.id) {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_ACTIVE_MODULE,
        payload: currentModule
      });
    }
  }, [location.pathname, state.modules, state.activeModule]);

  // Load navigation state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('navigationState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Restore navigation preferences
        if (parsedState.navigationPreferences) {
          dispatch({
            type: NAVIGATION_ACTIONS.SET_NAVIGATION_PREFERENCES,
            payload: parsedState.navigationPreferences
          });
        }

        // Restore user profile preferences
        if (parsedState.userProfile?.preferences) {
          dispatch({
            type: NAVIGATION_ACTIONS.SET_USER_PROFILE,
            payload: { preferences: parsedState.userProfile.preferences }
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load navigation state from localStorage:', error);
    }
  }, []);

  // Save navigation state to localStorage when it changes
  useEffect(() => {
    try {
      const stateToSave = {
        navigationPreferences: state.navigationPreferences,
        userProfile: {
          preferences: state.userProfile.preferences
        }
      };
      localStorage.setItem('navigationState', JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save navigation state to localStorage:', error);
    }
  }, [state.navigationPreferences, state.userProfile.preferences]);

  // Action Creators
  const actions = {
    setActiveModule: (module) => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_ACTIVE_MODULE,
        payload: module
      });
    },

    updateUserProfile: (profileData) => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_USER_PROFILE,
        payload: profileData
      });
    },

    updateNavigationPreferences: (preferences) => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_NAVIGATION_PREFERENCES,
        payload: preferences
      });
    },

    setLoadingState: (isLoading, message = '') => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_LOADING_STATE,
        payload: { isLoading, message }
      });
    },

    toggleMobileMenu: () => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_MOBILE_MENU_OPEN,
        payload: !state.ui.isMobileMenuOpen
      });
    },

    setMobileMenuOpen: (isOpen) => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_MOBILE_MENU_OPEN,
        payload: isOpen
      });
    },

    toggleAccountDropdown: () => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_ACCOUNT_DROPDOWN_OPEN,
        payload: !state.ui.isAccountDropdownOpen
      });
    },

    setAccountDropdownOpen: (isOpen) => {
      dispatch({
        type: NAVIGATION_ACTIONS.SET_ACCOUNT_DROPDOWN_OPEN,
        payload: isOpen
      });
    },

    resetNavigationState: () => {
      dispatch({
        type: NAVIGATION_ACTIONS.RESET_NAVIGATION_STATE
      });
    }
  };

  // Utility functions
  const utils = {
    getModuleByRoute: (route) => {
      return state.modules.find(module => route.startsWith(module.route));
    },

    getModuleById: (id) => {
      return state.modules.find(module => module.id === id);
    },

    isModuleActive: (moduleId) => {
      return state.activeModule?.id === moduleId;
    },

    getRecentlyAccessedModules: () => {
      return state.modules
        .filter(module => module.lastAccessed)
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        .slice(0, 3);
    }
  };

  const contextValue = {
    state,
    actions,
    utils
  };

  return (
    <NavigationStateContext.Provider value={contextValue}>
      {children}
    </NavigationStateContext.Provider>
  );
};

// Custom Hook for using Navigation State
export const useNavigationState = () => {
  const context = useContext(NavigationStateContext);
  
  if (!context) {
    throw new Error('useNavigationState must be used within a NavigationStateProvider');
  }
  
  return context;
};

// HOC for components that need navigation state
export const withNavigationState = (Component) => {
  return function NavigationStateComponent(props) {
    const navigationState = useNavigationState();
    return <Component {...props} navigationState={navigationState} />;
  };
};

export default NavigationStateProvider;