import React from 'react';
import Icon from '../AppIcon';

const ModuleIcon = ({ 
  iconName, 
  size = 20, 
  colorTheme = 'primary', 
  isActive = false, 
  className = '',
  ...props 
}) => {
  const getColorClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-out';
    
    if (isActive) {
      switch (colorTheme) {
        case 'primary':
          return `${baseClasses} text-primary-600`;
        case 'secondary':
          return `${baseClasses} text-secondary-600`;
        case 'accent':
          return `${baseClasses} text-accent-600`;
        case 'success':
          return `${baseClasses} text-success-600`;
        case 'warning':
          return `${baseClasses} text-warning-600`;
        case 'error':
          return `${baseClasses} text-error-600`;
        default:
          return `${baseClasses} text-primary-600`;
      }
    } else {
      return `${baseClasses} text-text-secondary group-hover:text-text-primary`;
    }
  };

  const getHoverEffects = () => {
    if (isActive) return '';
    
    switch (colorTheme) {
      case 'primary':
        return 'group-hover:text-primary-500';
      case 'secondary':
        return 'group-hover:text-secondary-500';
      case 'accent':
        return 'group-hover:text-accent-500';
      case 'success':
        return 'group-hover:text-success-500';
      case 'warning':
        return 'group-hover:text-warning-500';
      case 'error':
        return 'group-hover:text-error-500';
      default:
        return 'group-hover:text-primary-500';
    }
  };

  const iconClasses = `${getColorClasses()} ${getHoverEffects()} ${className}`;

  return (
    <Icon 
      name={iconName} 
      size={size} 
      className={iconClasses}
      {...props}
    />
  );
};

// Predefined module icon configurations
export const ModuleIcons = {
  FoodControl: {
    icon: 'Utensils',
    colorTheme: 'primary',
    description: 'Food service management and menu control'
  },
  IdealSleep: {
    icon: 'Moon',
    colorTheme: 'secondary',
    description: 'Sleep tracking and monitoring'
  },
  HydroTrack: {
    icon: 'Droplets',
    colorTheme: 'secondary',
    description: 'Hydration tracking and water intake'
  },
  Consults: {
    icon: 'MessageCircle',
    colorTheme: 'success',
    description: 'Consultation and communication hub'
  },
  Profile: {
    icon: 'User',
    colorTheme: 'accent',
    description: 'User profile and account settings'
  },
  Settings: {
    icon: 'Settings',
    colorTheme: 'accent',
    description: 'Application settings and preferences'
  },
  Notifications: {
    icon: 'Bell',
    colorTheme: 'warning',
    description: 'Alerts and notification management'
  },
  Help: {
    icon: 'HelpCircle',
    colorTheme: 'secondary',
    description: 'Help and support resources'
  }
};

// Component for rendering predefined module icons
export const PredefinedModuleIcon = ({ 
  moduleType, 
  isActive = false, 
  size = 20, 
  className = '',
  ...props 
}) => {
  const moduleConfig = ModuleIcons[moduleType];
  
  if (!moduleConfig) {
    console.warn(`Module type "${moduleType}" not found in ModuleIcons configuration`);
    return (
      <ModuleIcon 
        iconName="HelpCircle" 
        colorTheme="secondary" 
        isActive={isActive}
        size={size}
        className={className}
        {...props}
      />
    );
  }

  return (
    <ModuleIcon 
      iconName={moduleConfig.icon}
      colorTheme={moduleConfig.colorTheme}
      isActive={isActive}
      size={size}
      className={className}
      {...props}
    />
  );
};

export default ModuleIcon;