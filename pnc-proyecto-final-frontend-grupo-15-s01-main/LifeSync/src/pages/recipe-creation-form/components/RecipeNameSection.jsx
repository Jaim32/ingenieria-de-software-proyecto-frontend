import React from 'react';
import Icon from 'components/AppIcon';

function RecipeNameSection({ value, onChange, error }) {
  return (
    <div className="bg-surface rounded-card p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="ChefHat" size={20} color="white" />
        </div>
        <h2 className="font-heading font-heading-semibold text-xl text-text-primary">
          Recipe Name
        </h2>
      </div>
      
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your recipe name..."
          className={`w-full px-4 py-3 border rounded-lg font-body font-body-normal text-text-primary placeholder-text-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? 'border-error' : 'border-border-color hover:border-primary'
          }`}
        />
        {error && (
          <p className="text-error text-sm font-body font-body-medium flex items-center space-x-1">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default RecipeNameSection;