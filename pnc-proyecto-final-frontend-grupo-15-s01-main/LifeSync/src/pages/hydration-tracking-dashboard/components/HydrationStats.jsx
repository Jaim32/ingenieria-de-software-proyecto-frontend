// src/pages/hydrotrack/components/HydrationStats.jsx
import React from 'react';
import Icon from 'components/AppIcon';

/* ==========================================================
   Tarjetas de estadísticas (HydroTrack)
   ========================================================== */
const HydrationStats = ({ progressPercentage, currentIntake, dailyTarget, remainingAmount }) =>  {
  /* ---------- tarjetas “Daily Statistics” ------------------ */
  const stats = [
    {
      id: 'target',
      label: 'Daily Target',
      value: `${dailyTarget}ml`,
      icon: 'Target',
      iconColor: 'text-primary-600',   // azul
      valueColor: 'text-primary-600',
      bgColor: 'bg-primary-50',      // pastel azul
      desc: 'Your hydration goal',
    },
    {
      id: 'current',
      label: 'Current Intake',
      value: `${currentIntake}ml`,
      icon: 'Droplets',
      iconColor: 'text-secondary-600', // cian
      valueColor: 'text-secondary-600',
      bgColor: 'bg-cyan-50',         // pastel cian
      desc: 'Water consumed today',
    },
    {
      id: 'remaining',
      label: 'Remaining',
      value: remainingAmount > 0 ? `${remainingAmount}ml`
        : 'Goal Achieved!',
      icon: remainingAmount > 0 ? 'Clock' : 'CheckCircle',
      iconColor: remainingAmount > 0 ? 'text-warning'
        : 'text-success',
      valueColor: remainingAmount > 0 ? 'text-warning'
        : 'text-success',
      bgColor: remainingAmount > 0 ? 'bg-amber-50'
        : 'bg-emerald-50',
      desc: remainingAmount > 0 ? 'Left to reach goal'
        : 'Congratulations!',
    },
  ];

  /* ---------- texto motivacional --------------------------- */
  const statusText =
    progressPercentage >= 100 ? 'Excellent! Goal achieved' :
      progressPercentage >= 75 ? 'Great progress!' :
        progressPercentage >= 50 ? 'Halfway there!' :
          progressPercentage >= 25 ? 'Good start!' :
            "Let's get hydrated!";

  return (
    <div className="theme-hydro space-y-6">
      {/* ======== Tarjeta de estado general ======== */}
      <div className="card text-center">
        <span
          className={`
            inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
            ${progressPercentage >= 100 ? 'bg-emerald-50' : 'bg-primary-50'}
          `}
        >
          <Icon
            name={progressPercentage >= 100 ? 'Trophy' : 'Activity'}
            size={32}
            strokeWidth={2}
            className={progressPercentage >= 100 ? 'text-success'
              : 'text-primary-600'}
          />
        </span>

        <h3 className="text-lg font-semibold text-primary mb-2">
          {statusText}
        </h3>
        <p className="text-secondary text-sm">
          {Math.round(progressPercentage)}% of daily goal completed
        </p>
      </div>

      {/* ======== Tarjetas individuales ======== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">
          Daily Statistics
        </h3>

        {stats.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-center space-x-4">
              {/* Icono */}
              <span className={`flex items-center justify-center w-12 h-12 rounded-lg ${s.bgColor}`}>
                <Icon name={s.icon} size={24} strokeWidth={2} className={s.iconColor} />
              </span>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-primary">{s.label}</h4>
                <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
                <p className="text-sm text-secondary">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======== Fracción y barra de progreso ======== */}
      <div className="card text-center">
        <h4 className="font-semibold text-primary mb-2">Today's Progress</h4>

        <div className="text-3xl font-bold text-secondary-600 mb-2">
          {currentIntake}
          <span className="text-tertiary mx-2">/</span>
          <span className="text-2xl font-bold">{dailyTarget} ml</span>
          <span className="text-sm font-normal text-secondary ml-1">ml</span>
        </div>

        <div className="w-full bg-border h-2 rounded-full">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercentage}%`,
              backgroundImage:
                'linear-gradient(to right, var(--color-primary-600), var(--color-secondary-600))',
            }}
          />
        </div>
      </div>

      {/* ======== Tip motivacional ======== */}
      <div className="card">
        <h4 className="font-semibold text-primary mb-3 flex items-center space-x-2">
          <Icon name="Lightbulb" size={20} strokeWidth={2} className="text-warning" />
          <span>Hydration Tip</span>
        </h4>

        <p className="text-sm text-secondary">
          {progressPercentage < 25 ? 'Start your day with a glass of water to kick-start your hydration!'
            : progressPercentage < 50 ? 'Keep a water bottle nearby as a visual reminder to drink more.'
              : progressPercentage < 75 ? "You're doing great! Try adding lemon or cucumber for variety."
                : progressPercentage < 100 ? 'Almost there! A few more sips and you’ll reach your goal.'
                  : 'Excellent work! Maintain this habit for optimal health benefits.'}
        </p>
      </div>
    </div>
  );
};

export default HydrationStats;
