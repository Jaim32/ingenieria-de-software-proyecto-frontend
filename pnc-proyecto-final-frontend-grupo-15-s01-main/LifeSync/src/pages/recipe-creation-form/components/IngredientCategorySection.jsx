import React from 'react';
import Icon from 'components/AppIcon';

function IngredientCategorySection({ title, icon, category, data, onChange }) {
  const ingredientOptions = {
    proteins: [
      { value: '', label: 'Select protein...' },
      { value: 'chicken', label: 'Chicken' },
      { value: 'beef', label: 'Beef' },
      { value: 'pork', label: 'Pork' },
      { value: 'fish', label: 'Fish' },
      { value: 'tofu', label: 'Tofu' },
      { value: 'eggs', label: 'Eggs' },
      { value: 'beans', label: 'Beans' },
      { value: 'lentils', label: 'Lentils' }
    ],
    vegetables: [
      { value: '', label: 'Select vegetable...' },
      { value: 'onions', label: 'Onions' },
      { value: 'carrots', label: 'Carrots' },
      { value: 'bell-peppers', label: 'Bell Peppers' },
      { value: 'tomatoes', label: 'Tomatoes' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'spinach', label: 'Spinach' },
      { value: 'mushrooms', label: 'Mushrooms' },
      { value: 'garlic', label: 'Garlic' }
    ],
    carbohydrates: [
      { value: '', label: 'Select carbohydrate...' },
      { value: 'rice', label: 'Rice' },
      { value: 'pasta', label: 'Pasta' },
      { value: 'bread', label: 'Bread' },
      { value: 'potatoes', label: 'Potatoes' },
      { value: 'quinoa', label: 'Quinoa' },
      { value: 'oats', label: 'Oats' },
      { value: 'noodles', label: 'Noodles' },
      { value: 'flour', label: 'Flour' }
    ]
  };

  const cookingMethods = [
    { value: '', label: 'Select method...' },
    { value: 'grilled', label: 'Grilled' },
    { value: 'baked', label: 'Baked' },
    { value: 'fried', label: 'Fried' },
    { value: 'steamed', label: 'Steamed' },
    { value: 'boiled', label: 'Boiled' },
    { value: 'sauteed', label: 'Sautéed' },
    { value: 'roasted', label: 'Roasted' },
    { value: 'raw', label: 'Raw' }
  ];

  return (
    <div className="bg-surface rounded-card p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icon name={icon} size={16} color="white" />
        </div>
        <h3 className="font-heading font-heading-semibold text-lg text-text-primary">
          {title}
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* Ingredient Type */}
        <div>
          <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
            Type
          </label>
          <select
            value={data.type}
            onChange={(e) => onChange(category, 'type', e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-lg font-body font-body-normal text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary"
          >
            {ingredientOptions[category].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
            Weight/Amount
          </label>
          <input
            type="text"
            value={data.weight}
            onChange={(e) => onChange(category, 'weight', e.target.value)}
            placeholder="e.g., 500g, 2 cups"
            className="w-full px-3 py-2 border border-border-color rounded-lg font-body font-body-normal text-text-primary placeholder-text-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary"
          />
        </div>

        {/* Cooking Method */}
        <div>
          <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
            Cooking Method
          </label>
          <select
            value={data.cookingMethod}
            onChange={(e) => onChange(category, 'cookingMethod', e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-lg font-body font-body-normal text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary"
          >
            {cookingMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default IngredientCategorySection;