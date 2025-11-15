// src/pages/daily-nutrition-overview-dashboard/components/QuickMealLogger.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";

function QuickMealLogger() {
  const [selectedMealType, setSelectedMealType] = useState("");
  const navigate = useNavigate();

  const mealTypes = [
    { id: "breakfast", name: "Breakfast", icon: "Coffee", color: "bg-nutri-accent" },
    { id: "lunch", name: "Lunch", icon: "Sun", color: "bg-nutri-warning" },
    { id: "dinner", name: "Dinner", icon: "Moon", color: "bg-nutri-secondary" },
    { id: "snack", name: "Snack", icon: "Apple", color: "bg-nutri-success" }
  ];

  const handleMealTypeSelect = (mealType) => {
    setSelectedMealType(mealType);
    navigate('/calorie-tracking-dashboard', { state: { mealType } });
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Quick Log</h3>
        <Icon name="Plus" size={16} className="text-primary" />
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-text-secondary">Select Meal Type</h4>
        <div className="grid grid-cols-2 gap-3">
          {mealTypes.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMealTypeSelect(m.id)}
              className={`
                flex flex-col items-center p-4 border border-border rounded-lg
                hover:border-primary transition-smooth group
                ${selectedMealType === m.id ? "ring-2 ring-primary" : ""}
              `}
            >
              <div className={`w-10 h-10 ${m.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-smooth`}>
                <Icon name={m.icon} size={20} color="white" />
              </div>
              <span className="text-sm font-medium text-text-primary">{m.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickMealLogger;
