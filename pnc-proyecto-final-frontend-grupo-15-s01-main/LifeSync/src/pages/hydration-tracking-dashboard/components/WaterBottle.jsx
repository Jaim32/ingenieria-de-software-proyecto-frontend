import React from 'react';

const WaterBottle = ({ currentIntake, dailyGoal, progressPercentage }) => {
  // 1) Normaliza el % (0–100)
  const pct = dailyGoal > 0
  ? Math.min(Math.max((currentIntake / dailyGoal) * 100, 0), 100)
  : 0;

  // 2) Constantes SVG
  const MAX_FILL = 136;   // alto interior de la botella (178 – 42)
  const BASE_Y   = 178;   // coordenada Y del "suelo" del agua en el SVG

  // 3) Regla de 3: (pct/100) * MAX_FILL
  const fillHeight = (pct / 100) * MAX_FILL;
  const fillY      = BASE_Y - fillHeight;

  console.log('pct →', pct, 'fillHeight →', fillHeight, 'fillY →', fillY);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-32 h-64 sm:w-40 sm:h-80">
        <svg
          viewBox="0 0 120 200"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottle Outline */}
          <path
            d="M35 40 L35 180 Q35 190 45 190 L75 190 Q85 190 85 180 L85 40 Q85 35 80 35 L75 35 L75 20 Q75 15 70 15 L50 15 Q45 15 45 20 L45 35 L40 35 Q35 35 35 40 Z"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* Defs para gradiente y clip */}
          <defs>
            <clipPath id="bottleClip">
              <path d="M37 42 L37 178 Q37 188 47 188 L73 188 Q83 188 83 178 L83 42 Q83 37 78 37 L73 37 L73 22 Q73 17 68 17 L52 17 Q47 17 47 22 L47 37 L42 37 Q37 37 37 42 Z" />
            </clipPath>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0891B2" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Water Fill */}
          <rect
            x="37"
            y={fillY}
            width="46"
            height={fillHeight}
            fill="url(#waterGradient)"
            clipPath="url(#bottleClip)"
            className="transition-all duration-500 ease-out"
          />

          {/* Water Surface */}
          {pct > 0 && (
            <ellipse
              cx="60"
              cy={fillY}
              rx="22"
              ry="2"
              fill="#06B6D4"
              opacity="0.6"
              clipPath="url(#bottleClip)"
              className="animate-pulse"
            />
          )}

          {/* Bottle Cap */}
          <rect
            x="47"
            y="15"
            width="26"
            height="7"
            rx="3"
            fill="#6B7280"
            className="drop-shadow-sm"
          />

          {/* Measurement Lines */}
          <g stroke="#D1D5DB" strokeWidth="0.5" opacity="0.7">
            <line x1="85" y1="60" x2="90" y2="60" />
            <line x1="85" y1="100" x2="90" y2="100" />
            <line x1="85" y1="140" x2="90" y2="140" />
            <line x1="85" y1="180" x2="90" y2="180" />
          </g>
        </svg>

        {/* Water Amount Display */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-surface border border-border rounded-lg px-3 py-1 shadow-elevation-1">
          <span className="text-sm font-medium text-primary">
            {currentIntake} ml
          </span>
        </div>
      </div>

      {/* Goal Achievement Badge */}
      {pct >= 100 && (
        <div className="absolute -top-4 -right-4 bg-success text-white rounded-full p-2 shadow-elevation-2 animate-bounce">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default WaterBottle;
