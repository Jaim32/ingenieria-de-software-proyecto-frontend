import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <Icon name="Moon" size={64} className="text-primary mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist. Let's get you back to your sleep optimization journey.
          </p>
        </div>
        
        <Link
          to="/sleep-cycle-calculator-dashboard"
          className="
            inline-flex items-center space-x-2 px-6 py-3 
            bg-primary hover:bg-primary-600 text-white 
            rounded-xl font-medium transition-smooth
          "
        >
          <Icon name="Home" size={20} />
          <span>Back to Sleep Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;