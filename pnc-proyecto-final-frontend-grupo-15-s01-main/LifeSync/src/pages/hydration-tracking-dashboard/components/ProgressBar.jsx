// src/pages/hydrotrack/components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ progressPercentage, currentIntake, dailyTarget }) =>  {
  const milestones = [0, 25, 50, 75, 100];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Barra principal */}
      <div className="relative">
        <div className="w-full h-4 bg-primary-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* % flotante */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="bg-white border border-primary-200 rounded-lg px-3 py-1 shadow">
            <span className="text-sm font-bold text-primary-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Etiquetas 0 ml / Goal */}
      <div className="flex justify-between items-center mt-4 text-sm font-medium">
        <span className="text-primary-600">{currentIntake} ml</span>
        <span className="text-primary-600">Goal: {dailyTarget} ml</span>
      </div>

      {/* Milestones */}
      <div className="mt-2 select-none">
        {/* números */}
        <div className="flex justify-between text-xs text-primary">
          <span>0 ml</span><span>500 ml</span><span>1000 ml</span><span>1500 ml</span><span>2000 ml</span>
        </div>

        {/* bolitas azules */}
        <div className="flex justify-between mt-1">
          {milestones.map((m) => (
            <span
              key={m}
              className={`
                w-2 h-2 rounded-full
                ${progressPercentage >= m ? 'bg-primary-600' : 'bg-primary-300'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
