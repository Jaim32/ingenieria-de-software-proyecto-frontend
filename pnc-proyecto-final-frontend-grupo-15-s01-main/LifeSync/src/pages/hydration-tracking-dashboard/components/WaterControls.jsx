import React from 'react';
import Icon from 'components/AppIcon';

const WaterControls = ({
  customAmount,
  setCustomAmount,
  addWater,
  quickAddWater,
  resetProgress,
  removeWater
}) => {
  const handleCustomAmountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCustomAmount(Math.max(0, Math.min(1000, value))); // Limit between 0-1000ml
  };

  const incrementAmount = () => {
    setCustomAmount(prev => Math.min(1000, prev + 50));
  };

  const decrementAmount = () => {
    setCustomAmount(prev => Math.max(50, prev - 50));
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Custom Amount Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4 text-center">
          Add Water
        </h3>

        {/* Amount Input with Plus/Minus */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={decrementAmount}
            className="w-12 h-12 bg-surface-secondary hover:bg-border border border-border rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-touch-target"
            aria-label="Decrease amount"
          >
            <Icon name="Minus" size={20} strokeWidth={2.5} className="text-gray-800" />
          </button>

          <div className="flex flex-col items-center">
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-24 text-center text-2xl font-bold text-primary bg-transparent border-none focus:outline-none"
              min="50"
              max="1000"
              step="50"
            />
            <span className="text-sm text-secondary font-medium">ml</span>
          </div>

          <button
            onClick={incrementAmount}
            className="w-12 h-12 bg-surface-secondary hover:bg-border border border-border rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-touch-target"
            aria-label="Increase amount"
          >
            <Icon name="Plus" size={20} strokeWidth={2.5} className="text-gray-800" />
          </button>
        </div>

        {/* Add Custom Amount Button */}
        <button
          onClick={() => addWater(customAmount)}
          className="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-elevation-2 min-touch-target"
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Plus" size={20} strokeWidth={2.5} />
            <span>Add {customAmount}ml</span>
          </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {/* Quick Add 250 ml */}
        <button
          onClick={quickAddWater}
          className="
          bg-secondary hover:bg-secondary-700 text-white font-medium
          py-3 px-4 rounded-lg transition-all duration-200 active:scale-98
          focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
          shadow-elevation-1 min-touch-target
        "
        >
          <div className="flex flex-col items-center space-y-1">
            <Icon name="Droplets" size={24} strokeWidth={2} />
            <span className="text-sm">Quick Add</span>
            <span className="text-xs opacity-90">250ml</span>
          </div>
        </button>

        {/* Reset Progress */}
        <button
          onClick={resetProgress}
          className="
          bg-surface hover:bg-border text-primary border border-border
          font-medium py-3 px-4 rounded-lg transition-all duration-200 active:scale-98
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          min-touch-target
        "
        >
          <div className="flex flex-col items-center space-y-1">
            <Icon name="RotateCcw" size={24} strokeWidth={2} />
            <span className="text-sm">Reset</span>
            <span className="text-xs opacity-70">Clear Day</span>
          </div>
        </button>
      </div>

      {/* Subtract Water (Emergency) */}
      <div className="flex justify-center">
        <button
        onClick={removeWater}
        className="btn btn-outline flex-1 ml-2"
      >
        – Remove 100 ml
      </button>
      </div>
    </div>
  );
};

export default WaterControls;