// src/pages/calorie-tracking-dashboard/components/QuantitySelector.jsx
import React from 'react';
import PropTypes from 'prop-types';

const QuantitySelector = ({ quantity, onQuantityChange, max = 10, buttonColor = 'emerald' }) => {
  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrease}
        disabled={quantity === 0}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center text-sm font-medium transition-colors duration-200"
        aria-label="Decrease quantity"
      >
        −
      </button>
      
      <span className="w-8 text-center text-sm font-medium text-gray-700">
        {quantity}
      </span>
      
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`w-8 h-8 rounded-full bg-${buttonColor}-600 hover:bg-${buttonColor}-700 disabled:bg-gray-100 disabled:text-gray-400 text-white flex items-center justify-center text-sm font-medium transition-colors duration-200`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  max: PropTypes.number,
  buttonColor: PropTypes.string
};

export default QuantitySelector;