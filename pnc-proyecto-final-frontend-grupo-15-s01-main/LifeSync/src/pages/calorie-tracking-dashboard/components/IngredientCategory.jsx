
import React from 'react';
import PropTypes from 'prop-types';
import IngredientCard from './IngredientCard';

const IngredientCategory = ({
  categoryKey,
  category,
  selectedIngredients,
  onIngredientUpdate,
  getIngredientQuantity,
  getCategoryTotals,
  isExpanded,
  onToggleExpand,
  onScrollCategory // prop para scroll infinito
}) => {
  const categoryTotals = getCategoryTotals(categoryKey);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${category.borderColor}`}
    >
      {/* Category header */}
      <div
        className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => onToggleExpand(categoryKey)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`text-2xl ${category.color}`}>{category.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {category.title}
            </h3>
            <span
              className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
            >
              ▼
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Category Total</div>
            <div className={`text-sm font-medium ${category.color}`}>
              {categoryTotals.calories.toFixed(0)} kcal
            </div>
          </div>
        </div>
      </div>

      {/* Category content con scroll interno */}
      {isExpanded && (
        <div
          className="p-6 max-h-[240px] overflow-y-auto"
          onScroll={e => onScrollCategory(e, categoryKey)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.ingredients.map(ingredient => (
              <IngredientCard
                key={`${categoryKey}-${ingredient.id}`}
                ingredient={ingredient}
                quantity={getIngredientQuantity(ingredient.id)}
                onQuantityChange={qty =>
                  onIngredientUpdate(ingredient, qty)
                }
                categoryColor={category.color}
                categoryBgColor={category.bgColor}
              />
            ))}
          </div>

          {/* Category totals */}
          {categoryTotals.calories > 0 && (
            <div className={`mt-6 p-4 ${category.bgColor} rounded-lg`}>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">
                  Category Totals:
                </span>
                <div className="flex space-x-4">
                  <span>{categoryTotals.calories.toFixed(0)} kcal</span>
                  <span>{categoryTotals.protein.toFixed(1)}g protein</span>
                  <span>{categoryTotals.carbs.toFixed(1)}g carbs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

IngredientCategory.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  selectedIngredients: PropTypes.array.isRequired,
  onIngredientUpdate: PropTypes.func.isRequired,
  getIngredientQuantity: PropTypes.func.isRequired,
  getCategoryTotals: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onScrollCategory: PropTypes.func.isRequired
};

export default IngredientCategory;