// src/pages/calorie-tracking-dashboard/components/IngredientCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import QuantitySelector from './QuantitySelector';

const IngredientCard = ({ ingredient, quantity, onQuantityChange, categoryColor, categoryBgColor }) => {
  return (
    <div className={`${categoryBgColor} rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">{ingredient.image}</span>
            <h4 className="font-medium text-gray-800">{ingredient.name}</h4>
          </div>
          
          <div className="text-xs text-gray-500 mb-2">
            Per {ingredient.serving}
          </div>
          
          <div className="flex space-x-3 text-xs text-gray-600">
            <span>{ingredient.calories} kcal</span>
            <span>{ingredient.protein}g protein</span>
            <span>{ingredient.carbs}g carbs</span>
          </div>
        </div>
        
        <div className="ml-4">
          <QuantitySelector 
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            buttonColor={categoryColor.replace('text-', '')}
          />
        </div>
      </div>
      
      {quantity > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className={`text-xs font-medium ${categoryColor}`}>
            Total: {(ingredient.calories * quantity).toFixed(0)} kcal, 
            {' '}{(ingredient.protein * quantity).toFixed(1)}g protein, 
            {' '}{(ingredient.carbs * quantity).toFixed(1)}g carbs
          </div>
        </div>
      )}
    </div>
  );
};

IngredientCard.propTypes = {
  ingredient: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  categoryColor: PropTypes.string.isRequired,
  categoryBgColor: PropTypes.string.isRequired
};

export default IngredientCard;