import React from 'react';
import Icon from 'components/AppIcon';

function FilterChips({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Browse by Category</h3>
      
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon name={filter.icon} size={16} />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterChips;