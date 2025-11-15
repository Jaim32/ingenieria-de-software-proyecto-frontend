import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

const API_BACK = import.meta.env.VITE_API_URL || 'http://localhost:8082';
const API_FDC = import.meta.env.VITE_FDC_BASE_URL || 'https://api.nal.usda.gov/fdc/v1';
const FDC_KEY = import.meta.env.VITE_FDC_API_KEY;

const calorieCache = new Map();

async function fetchCaloriesForItem(name) {
  if (!name) return 0;
  if (calorieCache.has(name)) return calorieCache.get(name);
  try {
    const url = `${API_FDC}/foods/search?api_key=${FDC_KEY}&query=${encodeURIComponent(name)}&pageSize=1&pageNumber=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    const first = json.foods?.[0];
    const kcal = first?.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value || 0;
    calorieCache.set(name, kcal);
    return kcal;
  } catch (e) {
    console.error('FDC error', e);
    calorieCache.set(name, 0);
    return 0;
  }
}

function CalorieProgressCard() {
  const [consumed, setConsumed] = useState(0);
  const [goal, setGoal] = useState(2000);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.idUsuario;
    const peso = userData.peso || 70;
    const altura = userData.altura || 1.7;
    const edad = userData.edad || 30;
    const objetivoPeso = userData.objetivoPeso || peso;
    const genero = userData.genero || 'masculino';

    let bmr = 0;
    if (genero === 'masculino') {
      bmr = 10 * peso + 6.25 * altura - 5 * edad + 5;
    } else {
      bmr = 10 * peso + 6.25 * altura - 5 * edad - 161;
    }

    if (objetivoPeso > peso) {
      setGoal(Math.round(bmr + 300));
      setIsMaintenance(false);
    } else if (objetivoPeso < peso) {
      setGoal(Math.round(bmr - 300));
      setIsMaintenance(false);
    } else {
      setGoal(Math.round(bmr));
      setIsMaintenance(true);
    }

    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BACK}/api/platillos/usuario/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          console.warn('Error al obtener platillos:', res.status);
          return;
        }

        const rawText = await res.text();
        if (!rawText) return;

        const data = JSON.parse(rawText);
        const platillos = Array.isArray(data) ? data : data.data ? data.data : [data];

        const uniqueNames = [...new Set(platillos.flatMap(p =>
          [p.proteina, p.carbohidrato, p.vegetal].filter(Boolean)
        ))];
        await Promise.all(uniqueNames.map(fetchCaloriesForItem));

        const totalCalories = platillos.reduce((sum, p) => {
          const kcal =
            (calorieCache.get(p.proteina) || 0) +
            (calorieCache.get(p.carbohidrato) || 0) +
            (calorieCache.get(p.vegetal) || 0);
          return sum + kcal;
        }, 0);

        setConsumed(Math.round(totalCalories));
      } catch (err) {
        console.error('Error obteniendo calorías:', err);
      }
    };

    if (userId) {
      fetchMeals();
    }
  }, []);

  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const isOverGoal = consumed > goal;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">Daily Calories</h3>
        <Icon name="Zap" size={16} className="text-success" />
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r={radius}
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200"
              fill="none"
            />
            <circle
              cx="50" cy="50" r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${isOverGoal ? 'text-warning' : 'text-success'}`}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-text-primary font-data">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-text-primary font-data">
            {consumed}
          </span>
          <span className="text-sm text-text-secondary">/ {goal} cal</span>
        </div>

        <div className="flex items-center justify-center space-x-1">
          <Icon
            name={isOverGoal ? 'AlertTriangle' : 'Target'}
            size={14}
            className={isOverGoal ? 'text-warning' : 'text-success'}
          />
          <span className={`text-sm ${isOverGoal ? 'text-warning' : 'text-success'}`}>
            {isOverGoal
              ? `${consumed - goal} over goal`
              : `${remaining} remaining`}
          </span>
        </div>

        {isMaintenance && (
          <div className="mt-2 text-xs text-text-secondary italic">
            Esto representa tu ingesta calórica mínima para mantener funciones vitales (BMR).
          </div>
        )}
      </div>
    </div>
  );
}

export default CalorieProgressCard;
