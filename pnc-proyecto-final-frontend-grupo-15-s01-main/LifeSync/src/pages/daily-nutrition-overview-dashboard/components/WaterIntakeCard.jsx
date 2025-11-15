// src/pages/daily-nutrition-overview-dashboard/components/WaterIntakeCard.jsx
import React from "react";
import Icon from "components/AppIcon";

export default function WaterIntakeCard({ consumed, target }) {
  const pct = (consumed / target) * 100;
  const glasses = Array.from({ length: target }, (_, i) => i + 1);

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      {/* título */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          Water Intake
        </h3>
        <Icon name="Droplets" size={16} className="text-nutri-water" />
      </div>

      {/* vasitos */}
      <div className="flex items-center justify-center mb-4">
        <div className="grid grid-cols-4 gap-1">
          {glasses.map((g) => (
            <div
              key={g}
              className={`w-4 h-6 rounded-sm border-2
              ${
                g <= consumed
                  ? "bg-nutri-water border-nutri-water opacity-60"
                  : "bg-transparent border-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* progreso */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-text-primary font-data">
            {consumed}
          </span>
          <span className="text-sm text-text-secondary">
            / {target} glasses
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-nutri-water h-2 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-center space-x-1">
          <Icon name="Target" size={14} className="text-nutri-success" />
          <span className="text-sm text-nutri-success">
            {target - consumed > 0
              ? `${target - consumed} more to go`
              : "Goal achieved!"}
          </span>
        </div>
      </div>
    </div>
  );
}
