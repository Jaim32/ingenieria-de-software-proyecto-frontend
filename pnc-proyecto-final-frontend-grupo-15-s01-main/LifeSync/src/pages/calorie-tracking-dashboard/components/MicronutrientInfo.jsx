// src/pages/calorie-tracking-dashboard/components/MicronutrientInfo.jsx
import React from 'react';
import PropTypes from 'prop-types';

const MicronutrientInfo = ({ totalNutrition }) => {
  // Default values if not provided
  const { fiber = 0, sodium = 0, potassium = 0, vitaminC = 0 } = totalNutrition;
  
  // Daily recommended values
  const dailyValues = {
    fiber: 25, // g
    sodium: 2300, // mg
    potassium: 3500, // mg
    vitaminC: 90 // mg
  };
  
  // Calculate percentages of daily values
  const percentages = {
    fiber: Math.min((fiber / dailyValues.fiber) * 100, 100),
    sodium: Math.min((sodium / dailyValues.sodium) * 100, 100),
    potassium: Math.min((potassium / dailyValues.potassium) * 100, 100),
    vitaminC: Math.min((vitaminC / dailyValues.vitaminC) * 100, 100)
  };
  
  const micronutrients = [
    {
      name: 'Fiber',
      value: fiber.toFixed(1),
      unit: 'g',
      percentage: percentages.fiber,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800'
    },
    {
      name: 'Sodium',
      value: sodium.toFixed(0),
      unit: 'mg',
      percentage: percentages.sodium,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800'
    },
    {
      name: 'Potassium',
      value: potassium.toFixed(0),
      unit: 'mg',
      percentage: percentages.potassium,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-800'
    },
    {
      name: 'Vitamin C',
      value: vitaminC.toFixed(1),
      unit: 'mg',
      percentage: percentages.vitaminC,
      bgColor: 'bg-lime-100',
      textColor: 'text-lime-800'
    }
  ];

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Micronutrients</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {micronutrients.map((micro) => (
          <div key={micro.name} className={`${micro.bgColor} rounded-lg p-3`}>
            <div className="text-xs mb-1">{micro.name}</div>
            <div className={`font-semibold ${micro.textColor}`}>
              {micro.value} {micro.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MicronutrientInfo.propTypes = {
  totalNutrition: PropTypes.shape({
    fiber: PropTypes.number,
    sodium: PropTypes.number,
    potassium: PropTypes.number,
    vitaminC: PropTypes.number
  }).isRequired
};

export default MicronutrientInfo;