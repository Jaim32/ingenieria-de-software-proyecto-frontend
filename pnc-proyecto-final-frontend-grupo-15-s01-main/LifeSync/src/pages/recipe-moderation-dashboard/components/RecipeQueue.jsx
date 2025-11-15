import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RecipeQueue = ({
  recipes,
  selectedRecipe,
  onRecipeSelect,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onClose,
  totalCount,
  priorityCount,
  flaggedCount
}) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error border-error/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-secondary text-text-secondary border-border';
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'New': return 'bg-primary/10 text-primary border-primary/20';
      case 'Flagged': return 'bg-error/10 text-error border-error/20';
      case 'Healthy': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-secondary text-text-secondary border-border';
    }
  };

  const getMacroColor = (macro) => {
    switch (macro) {
      case 'Protein': return 'bg-accent/10 text-accent border-accent/20';
      case 'Carbs': return 'bg-primary/10 text-primary border-primary/20';
      case 'Veggies': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-secondary text-text-secondary border-border';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Queue Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary font-heading">
            Pending Reviews
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-micro"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search recipes or authors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 input-field text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 text-xs font-medium rounded border transition-micro ${
              activeFilter === 'all' ? 'bg-primary text-white border-primary' : 'text-text-secondary hover:text-text-primary hover:bg-secondary border-border'
            }`}
          >
            All ({totalCount})
          </button>
          
        </div>
      </div>

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {recipes.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Search" size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">No recipes found</p>
            </div>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.idReceta}
                className={`card p-4 cursor-pointer hover:shadow-medium transition-all duration-150 ${
                  selectedRecipe?.idReceta === recipe.idReceta ? 'ring-2 ring-primary/20 border-primary' : ''
                }`}
                onClick={() => onRecipeSelect(recipe)}
              >
                <div className="flex items-start space-x-3">
                  {/* Recipe Image */}
                  <div className="w-16 h-16 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={recipe.image}
                      alt={recipe.nombre ?? 'Receta'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Recipe Title */}
                    <h3 className="font-medium text-text-primary text-sm truncate mb-1">
{recipe.nombre?.trim() ? recipe.nombre : 'Sin título'}
                    </h3>

                    {/* Author Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                        {recipe.author?.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <span className="text-xs text-text-secondary truncate">
                        {recipe.author?.name ?? 'Autor desconocido'}
                      </span>
                    </div>

                    

                    {/* Priority Badge */}
                    <div className="flex items-center space-x-2 mb-2">
                      {recipe.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(recipe.priority)}`}>
                          {recipe.priority.charAt(0).toUpperCase() + recipe.priority.slice(1)} Priority
                        </span>
                      )}
                      {recipe.flags?.length > 0 && (
                        <span className="text-xs text-error">
                          {recipe.flags.length} flag{recipe.flags.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {recipe.badges?.map((badge, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs font-medium rounded border ${getBadgeColor(badge)}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Macronutrient Tags */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.macronutrients?.map((macro, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs font-medium rounded border ${getMacroColor(macro)}`}
                        >
                          {macro}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeQueue;