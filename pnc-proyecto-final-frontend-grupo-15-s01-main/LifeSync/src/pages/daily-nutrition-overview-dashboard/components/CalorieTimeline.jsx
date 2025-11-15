// src/components/CalorieTimeline.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Icon from 'components/AppIcon';

const API_BACK = import.meta.env.VITE_API_URL || 'http://localhost:8082';
const API_FDC = import.meta.env.VITE_FDC_BASE_URL || 'https://api.nal.usda.gov/fdc/v1';
const FDC_KEY = import.meta.env.VITE_FDC_API_KEY;

const colorMap = {
  desayuno: 'bg-yellow-400', breakfast: 'bg-yellow-400',
  almuerzo: 'bg-green-400', lunch: 'bg-green-400',
  cena: 'bg-indigo-400', dinner: 'bg-indigo-400',
  snack: 'bg-orange-400',
};

const capitalize = (txt) =>
  typeof txt === 'string' && txt.length
    ? txt.charAt(0).toUpperCase() + txt.slice(1)
    : 'Sin categoría';

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

export default function CalorieTimeline({ userId: propId }) {
  const userId =
    propId ??
    JSON.parse(localStorage.getItem('user') || '{}').idUsuario ??
    localStorage.getItem('userId');

  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotal] = useState(0);
  const [selectedMeal, setSel] = useState(null);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BACK}/api/platillos/usuario/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    if (res.status === 403) {
      console.warn('No autorizado para ver los platillos');
      return;
    }
    if (res.status === 404) {
      console.info('Usuario sin platillos registrados');
      setMeals([]);
      setTotal(0);
      return;
    }
    throw new Error(`Error HTTP: ${res.status}`);
  }

  // ✅ Evita fallo si la respuesta viene vacía
  const rawText = await res.text();
  if (!rawText) {
    console.warn('Respuesta vacía de platillos');
    setMeals([]);
    setTotal(0);
    return;
  }

  const raw = JSON.parse(rawText);
  const data = Array.isArray(raw) ? raw : raw.data ? raw.data : [raw];

  const uniqueNames = [...new Set(data.flatMap(p =>
    [p.proteina, p.carbohidrato, p.vegetal].filter(Boolean)
  ))];
  await Promise.all(uniqueNames.map(fetchCaloriesForItem));

  const mapped = data.map((p, i) => {
    const items = [p.proteina, p.carbohidrato, p.vegetal].filter(Boolean);
    const itemKcals = items.reduce((sum, nm) => sum + (calorieCache.get(nm) || 0), 0);
    return {
      id: p.id || `${p.meal}-${i}`,
      time: p.hora || '',
      name: capitalize(p.meal),
      calories: itemKcals,
      items,
      color: colorMap[(p.meal || '').toLowerCase()] ?? 'bg-primary',
    };
  });

  setMeals(mapped);
  setTotal(mapped.reduce((s, m) => s + m.calories, 0));
} catch (e) {
  console.error('Error platillos →', e);
}

    })();
  }, [userId]);

  const toggle = (meal) => setSel(sel => sel?.id === meal.id ? null : meal);
  const maxCal = useMemo(() => meals.length ? Math.max(...meals.map(m => m.calories)) : 1, [meals]);

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Calorie Timeline</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">Today's Meals</span>
        </div>
      </div>

      {meals.length ? (
        <div className="space-y-4">
          {meals.map((meal, idx) => (
            <div key={meal.id} className="relative">
              {idx < meals.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
              )}
              <div className="flex items-start space-x-4 cursor-pointer group" onClick={() => toggle(meal)}>
                <div className="flex-shrink-0 w-12 h-12 bg-background rounded-full flex items-center justify-center border-2 border-border group-hover:border-primary">
                  <span className="text-xs font-semibold text-text-secondary group-hover:text-primary">
                    {meal.time || '--'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary">
                      {meal.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-data text-text-primary">{meal.calories} cal</span>
                      <Icon
                        name={selectedMeal?.id === meal.id ? 'ChevronUp' : 'ChevronDown'}
                        size={16}
                        className="text-text-secondary group-hover:text-primary"
                      />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${meal.color}`}
                      style={{ width: `${(meal.calories / maxCal) * 100}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {meal.items.slice(0, 2).map((it, i) => (
                      <span key={i} className="text-xs bg-background px-2 py-1 rounded text-text-secondary">
                        {it}
                      </span>
                    ))}
                    {meal.items.length > 2 && (
                      <span className="text-xs text-text-secondary">+{meal.items.length - 2} more</span>
                    )}
                  </div>
                  {selectedMeal?.id === meal.id && (
                    <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                      <h5 className="text-sm font-semibold text-text-primary mb-2">Food Items:</h5>
                      <div className="space-y-1">
                        {meal.items.map((it, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">{it}</span>
                            <span className="text-xs font-data text-text-primary">
                              {calorieCache.get(it) || 0} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">No meals logged (sin filtro de fecha).</p>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-secondary">Total Calories</span>
          <span className="text-lg font-bold text-text-primary font-data">{totalCalories} cal</span>
        </div>
      </div>
    </div>
  );
}
