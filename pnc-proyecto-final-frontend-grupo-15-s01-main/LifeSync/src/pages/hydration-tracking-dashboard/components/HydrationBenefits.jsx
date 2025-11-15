import React, { useState } from 'react';
import Icon from 'components/AppIcon';

/**
 * Tarjeta “Benefits of Staying Hydrated”
 *  — Colores e iconografía según mockup (tonos pastel 50 + ícono saturado)
 *  — Animación slide-up al expandir cada beneficio
 */
const HydrationBenefits = () => {
  const [open, setOpen] = useState(null);

  const benefits = [
    {
      id: 'energy',
      title: 'Boosts Energy Levels',
      icon: 'Zap',
      text: 'text-amber-500',
      bg: 'bg-amber-50',
      short: 'Proper hydration helps maintain energy throughout the day.',
      full: `Even mild dehydration (~2 % of body weight) can drain energy and impair
              focus. Well-hydrated blood transports oxygen and nutrients efficiently,
              reducing fatigue and keeping you alert.`
    },
    {
      id: 'skin',
      title: 'Improves Skin Health',
      icon: 'Sparkles',
      text: 'text-cyan-600',
      bg: 'bg-cyan-50',
      short: 'Hydration keeps your skin moisturized and glowing.',
      full: `Water supports the skin’s barrier, flushes out toxins and improves
              elasticity, resulting in a plumper, healthier complexion.`
    },
    {
      id: 'brain',
      title: 'Enhances Brain Function',
      icon: 'Brain',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      short: 'Better focus, memory, and mental clarity.',
      full: `The brain is ~75 % water. Adequate hydration boosts short-term memory,
              processing speed and mood, while reducing headaches.`
    },
    {
      id: 'digestion',
      title: 'Supports Digestion',
      icon: 'Heart',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      short: 'Aids in nutrient absorption and waste elimination.',
      full: `Water breaks down food, dissolves nutrients for absorption and prevents
              constipation by keeping the digestive system moving smoothly.`
    },
    {
      id: 'temperature',
      title: 'Regulates Body Temperature',
      icon: 'Thermometer',
      text: 'text-sky-600',
      bg: 'bg-sky-50',
      short: 'Helps maintain optimal body temperature.',
      full: `Through sweating and respiration, water dissipates heat and protects
              the body from overheating during exercise or hot weather.`
    },
    {
      id: 'joints',
      title: 'Lubricates Joints',
      icon: 'Activity',
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
      short: 'Keeps joints flexible and reduces stiffness.',
      full: `Synovial fluid is mostly water. Staying hydrated reduces friction,
              improves mobility and lowers the risk of joint discomfort.`
    }
  ];

  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Benefits of Staying Hydrated
        </h2>
        <p className="text-secondary">
          Discover how proper hydration can improve your overall health and well-being
        </p>
      </div>

      {/* Benefit grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((b) => (
          <div
            key={b.id}
            onClick={() => toggle(b.id)}
            className="
              border border-border rounded-lg p-4 cursor-pointer
              transition-all duration-200 hover:shadow-elevation-2
            "
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <span className={`flex items-center justify-center w-10 h-10 rounded-lg ${b.bg} flex-shrink-0`}>
                <Icon name={b.icon} size={20} strokeWidth={2} className={b.text} />
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary">{b.title}</h3>
                  <Icon
                    name={open === b.id ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    strokeWidth={2}
                    className="text-secondary ml-2"
                  />
                </div>

                <p className="text-sm text-secondary mt-1">{b.short}</p>

                {open === b.id && (
                  <div className="mt-3 pt-3 border-t border-border animate-slide-up">
                    <p className="text-sm text-secondary leading-relaxed">
                      {b.full}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily guidelines */}
      <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg flex-shrink-0">
            <Icon name="Info" size={16} color="white" strokeWidth={2} />
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-2">
              Daily Hydration Guidelines
            </h4>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Adults: 8-10 glasses (≈ 2–2.5 L) of water daily</li>
              <li>• Increase intake during exercise or hot weather</li>
              <li>• Drink before you feel thirsty – thirst is an early warning</li>
              <li>• Pale-yellow urine generally indicates good hydration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydrationBenefits;
