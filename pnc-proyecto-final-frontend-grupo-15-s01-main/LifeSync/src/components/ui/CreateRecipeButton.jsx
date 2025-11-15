import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function CreateRecipeButton({ className = '', variant = 'floating' }) {
  const location = useLocation();
  const isBrowsePage = location.pathname === '/community-recipe-browse';

  if (variant === 'floating' && isBrowsePage) {
    return (
      <Link
        to="/recipe-creation-form"
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-modal flex items-center justify-center transition-smooth hover:bg-opacity-90 hover:scale-105 z-dropdown ${className}`}
        aria-label="Create new recipe"
      >
        <Icon name="Plus" size={24} />
      </Link>
    );
  }

  if (variant === 'inline') {
    return (
      <Link
        to="/recipe-creation-form"
        className={`inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-body font-body-medium transition-smooth hover:bg-opacity-90 shadow-card ${className}`}
      >
        <Icon name="Plus" size={18} />
        <span>Create Recipe</span>
      </Link>
    );
  }

  if (variant === 'prominent') {
    return (
      <Link
        to="/recipe-creation-form"
        className={`flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white rounded-lg font-body font-body-medium transition-smooth hover:bg-opacity-90 shadow-card w-full sm:w-auto ${className}`}
      >
        <Icon name="Plus" size={20} />
        <span>Share Your Recipe</span>
      </Link>
    );
  }

  return (
    <Link
      to="/recipe-creation-form"
      className={`inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-body font-body-medium transition-smooth hover:bg-opacity-90 ${className}`}
    >
      <Icon name="Plus" size={16} />
      <span>Create</span>
    </Link>
  );
}

export default CreateRecipeButton;