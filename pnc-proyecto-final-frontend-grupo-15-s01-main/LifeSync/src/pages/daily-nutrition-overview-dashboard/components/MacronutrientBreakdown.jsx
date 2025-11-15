import React from 'react';
import Icon from 'components/AppIcon';

function MacronutrientBreakdown({ macros }) {
 if (!macros) {
    return <p className="text-center py-4">No hay datos de macronutrientes.</p>;
  }
  const { protein, carbs, fats } = macros;

  const macroData = [
    {
      name: 'Protein',
      data: protein,
      color: 'text-primary',
      bgColor: 'bg-primary',
      icon: 'Zap',
      description: 'Builds and repairs muscle tissue'
    },
    {
      name: 'Carbohydrates',
      data: carbs,
      color: 'text-warning',
      bgColor: 'bg-warning',
      icon: 'Battery',
      description: 'Primary energy source for body and brain'
    },
    {
      name: 'Fats',
      data: fats,
      color: 'text-accent',
      bgColor: 'bg-accent',
      icon: 'Droplet',
      description: 'Essential for hormone production and absorption'
    }
  ];

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Macronutrient Breakdown</h3>
        <Icon name="BarChart3" size={16} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {macroData.map((macro) => {
          return (
            <div key={macro.name} className="text-center">
              {/* Icon */}
              <div className="mb-4">
                <div className={`w-12 h-12 ${macro.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                  <Icon name={macro.icon} size={20} color="white" />
                </div>
              </div>

              {/* Macro Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-text-primary">{macro.name}</h4>
                
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold text-text-primary font-data">
                    {macro.data.consumed}{macro.data.unit}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {macro.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Macro Balance Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-text-secondary">Daily Balance</span>
          <Icon name="Scale" size={16} className="text-text-secondary" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-text-secondary mb-1">Protein</div>
            <div className="text-sm font-data text-text-primary">
              {Math.round((protein.consumed / (protein.consumed + carbs.consumed + fats.consumed)) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Carbs</div>
            <div className="text-sm font-data text-text-primary">
              {Math.round((carbs.consumed / (protein.consumed + carbs.consumed + fats.consumed)) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Fats</div>
            <div className="text-sm font-data text-text-primary">
              {Math.round((fats.consumed / (protein.consumed + carbs.consumed + fats.consumed)) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MacronutrientBreakdown;