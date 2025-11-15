import React from 'react';
import Icon from 'components/AppIcon';

function RecipeDetailsSection({ 
  ingredientsList, 
  cookingSteps, 
  mealType,
  onIngredientsChange, 
  onStepsChange, 
  onMealTypeChange,
  ingredientsError, 
  stepsError,
  mealTypeError
}) {
  return (
    <div className="space-y-6">
      {/* Ingredients List */}
      <div className="bg-surface rounded-card p-6 shadow-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="List" size={16} color="white" />
          </div>
          <h3 className="font-heading font-heading-semibold text-lg text-text-primary">
            Complete Ingredients List
          </h3>
        </div>
        
        <div className="space-y-2">
          <textarea
            value={ingredientsList}
            onChange={(e) => onIngredientsChange(e.target.value)}
            placeholder={`List all ingredients with measurements:\n\n• 2 cups all-purpose flour\n• 1 tsp baking powder\n• 1/2 cup sugar\n• 3 large eggs\n• 1 cup milk\n• 2 tbsp olive oil\n• Salt to taste`}
            rows={8}
            className={`w-full px-4 py-3 border rounded-lg font-body font-body-normal text-text-primary placeholder-text-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              ingredientsError ? 'border-error' : 'border-border-color hover:border-primary'
            }`}
          />
          {ingredientsError && (
            <p className="text-error text-sm font-body font-body-medium flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{ingredientsError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Cooking Steps */}
      <div className="bg-surface rounded-card p-6 shadow-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={16} color="white" />
          </div>
          <h3 className="font-heading font-heading-semibold text-lg text-text-primary">
            Cooking Instructions
          </h3>
        </div>
        
        <div className="space-y-2">
          <textarea
            value={cookingSteps}
            onChange={(e) => onStepsChange(e.target.value)}
            placeholder={`Provide detailed step-by-step instructions:\n\n1. Preheat your oven to 350°F (175°C).\n2. In a large bowl, whisk together flour, baking powder, and salt.\n3. In another bowl, beat eggs and gradually add sugar until light and fluffy.\n4. Slowly mix in milk and olive oil to the egg mixture.\n5. Gradually fold the dry ingredients into the wet ingredients until just combined.\n6. Pour batter into prepared pan and bake for 25-30 minutes.\n7. Cool completely before serving.`}
            rows={12}
            className={`w-full px-4 py-3 border rounded-lg font-body font-body-normal text-text-primary placeholder-text-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              stepsError ? 'border-error' : 'border-border-color hover:border-primary'
            }`}
          />
          {stepsError && (
            <p className="text-error text-sm font-body font-body-medium flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{stepsError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Meal Type Field */}
      <div className="bg-surface rounded-card p-6 shadow-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Utensils" size={16} color="white" />
          </div>
          <h3 className="font-heading font-heading-semibold text-lg text-text-primary">
            Meal Type
          </h3>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={mealType}
            onChange={(e) => onMealTypeChange(e.target.value)}
            placeholder="e.g., Breakfast, Lunch, Dinner..."
            className={`w-full px-4 py-3 border rounded-lg font-body font-body-normal text-text-primary placeholder-text-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              mealTypeError ? 'border-error' : 'border-border-color hover:border-primary'
            }`}
          />
          {mealTypeError && (
            <p className="text-error text-sm font-body font-body-medium flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{mealTypeError}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailsSection;
