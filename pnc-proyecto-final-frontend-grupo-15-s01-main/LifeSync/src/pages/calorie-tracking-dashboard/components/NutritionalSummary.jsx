// src/pages/calorie-tracking-dashboard/components/NutritionalSummary.jsx
import React from 'react';
import PropTypes from 'prop-types';

const NutritionalSummary = ({ totalNutrition }) => {
  const { calories, protein, carbs } = totalNutrition;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Total Nutrition</h4>
      
      <div className="grid grid-cols-1 gap-3">
        {/* Calories */}
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-emerald-700">Calories</span>
            <span className="text-lg font-semibold text-emerald-800">
              {calories.toFixed(0)} kcal
            </span>
          </div>
        </div>
        
        {/* Protein */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">Protein</span>
            <span className="text-lg font-semibold text-blue-800">
              {protein.toFixed(1)}g
            </span>
          </div>
        </div>
        
        {/* Carbohydrates */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-700">Carbohydrates</span>
            <span className="text-lg font-semibold text-orange-800">
              {carbs.toFixed(1)}g
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

NutritionalSummary.propTypes = {
  totalNutrition: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired
  }).isRequired
};

export default NutritionalSummary;