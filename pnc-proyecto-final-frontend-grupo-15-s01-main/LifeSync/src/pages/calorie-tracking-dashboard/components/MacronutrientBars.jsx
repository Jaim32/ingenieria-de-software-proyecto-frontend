// src/pages/calorie-tracking-dashboard/components/MacronutrientBars.jsx
import React from 'react';
import PropTypes from 'prop-types';

const MacronutrientBars = ({ totalNutrition }) => {
  const { calories, protein, carbs } = totalNutrition;
  
  // Calculate percentages based on common daily targets
  const targets = {
    calories: 2000, // kcal
    protein: 150,   // g
    carbs: 250      // g
  };
  
  const percentages = {
    calories: Math.min((calories / targets.calories) * 100, 100),
    protein: Math.min((protein / targets.protein) * 100, 100),
    carbs: Math.min((carbs / targets.carbs) * 100, 100)
  };

  const macronutrients = [
    {
      name: 'Calories',
      value: calories.toFixed(0),
      unit: 'kcal',
      target: targets.calories,
      percentage: percentages.calories,
      color: 'emerald',
      bgColor: 'bg-emerald-200',
      fillColor: 'bg-emerald-600'
    },
    {
      name: 'Protein',
      value: protein.toFixed(1),
      unit: 'g',
      target: targets.protein,
      percentage: percentages.protein,
      color: 'blue',
      bgColor: 'bg-blue-200',
      fillColor: 'bg-blue-600'
    },
    {
      name: 'Carbs',
      value: carbs.toFixed(1),
      unit: 'g',
      target: targets.carbs,
      percentage: percentages.carbs,
      color: 'orange',
      bgColor: 'bg-orange-200',
      fillColor: 'bg-orange-600'
    }
  ];

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Macronutrients</h4>
      
      <div className="space-y-4">
        {macronutrients.map((macro) => (
          <div key={macro.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">{macro.name}</span>
              <span className="text-sm font-medium text-gray-800">
                {macro.value} / {macro.target} {macro.unit}
              </span>
            </div>
            
            <div className={`w-full h-2 ${macro.bgColor} rounded-full overflow-hidden`}>
              <div 
                className={`h-full ${macro.fillColor} transition-all duration-300 ease-out`}
                style={{ width: `${macro.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MacronutrientBars.propTypes = {
  totalNutrition: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired
  }).isRequired
};

export default MacronutrientBars;