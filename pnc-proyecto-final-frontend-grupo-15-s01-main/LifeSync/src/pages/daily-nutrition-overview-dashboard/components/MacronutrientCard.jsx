import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Icon from 'components/AppIcon';

const API_BACK = import.meta.env.VITE_API_URL || 'http://localhost:8082';
const API_FDC = import.meta.env.VITE_FDC_BASE_URL || 'https://api.nal.usda.gov/fdc/v1';
const FDC_KEY = import.meta.env.VITE_FDC_API_KEY;

const macroCache = new Map();
async function fetchMacrosForItem(name) {
  if (!name) return { protein: 0, carbs: 0, fats: 0 };
  if (macroCache.has(name)) return macroCache.get(name);

  try {
    const url = `${API_FDC}/foods/search?api_key=${FDC_KEY}&query=${encodeURIComponent(name)}&pageSize=1&pageNumber=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    const first = json.foods?.[0];

    const nutrients = first?.foodNutrients || [];

    const grams = {
      protein: nutrients.find(n => n.nutrientName?.toLowerCase().includes('protein'))?.value || 0,
      carbs: nutrients.find(n => n.nutrientName?.toLowerCase().includes('carbohydrate'))?.value || 0,
      fats: nutrients.find(n => n.nutrientName?.toLowerCase().includes('fat') && !n.nutrientName.toLowerCase().includes('saturated'))?.value || 0,
    };

    macroCache.set(name, grams);
    return grams;

  } catch (e) {
    console.error('FDC error', e);
    const fallback = { protein: 0, carbs: 0, fats: 0 };
    macroCache.set(name, fallback);
    return fallback;
  }
}

export default function MacronutrientCard() {
  const [macros, setMacros] = useState({
    protein: { consumed: 0, unit: 'g' },
    carbs: { consumed: 0, unit: 'g' },
    fats: { consumed: 0, unit: 'g' },
  });

  useEffect(() => {
    const userId =
      JSON.parse(localStorage.getItem('user') || '{}').idUsuario ??
      localStorage.getItem('userId');

    if (!userId) return;

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BACK}/api/platillos/usuario/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const rawText = await res.text();
        if (!rawText) return;
        const data = JSON.parse(rawText);

        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        for (const platillo of data) {
          const alimentos = [platillo.proteina, platillo.carbohidrato, platillo.vegetal].filter(Boolean);
          for (const item of alimentos) {
            const macros = await fetchMacrosForItem(item);
            totalProtein += macros.protein;
            totalCarbs += macros.carbs;
            totalFats += macros.fats;
          }
        }

        setMacros({
          protein: { consumed: Math.round(totalProtein), unit: 'g' },
          carbs: { consumed: Math.round(totalCarbs), unit: 'g' },
          fats: { consumed: Math.round(totalFats), unit: 'g' },
        });

      } catch (e) {
        console.error('Error obteniendo platillos/macros →', e);
      }
    })();
  }, []);

  const { protein, carbs, fats } = macros;
  const total = protein.consumed + carbs.consumed + fats.consumed || 1;

  const legend = [
    { key: 'protein', label: 'Protein', bg: 'bg-nutri-success', txt: 'text-nutri-success' },
    { key: 'carbs', label: 'Carbs', bg: 'bg-nutri-warning', txt: 'text-nutri-warning' },
    { key: 'fats', label: 'Fats', bg: 'bg-nutri-accent', txt: 'text-nutri-accent' },
  ];

  const segments = ['protein', 'carbs', 'fats'].map((type) => {
    const offset = {
      protein: 0,
      carbs: (protein.consumed / total) * 251.2,
      fats: ((protein.consumed + carbs.consumed) / total) * 251.2,
    }[type];

    const pct = (macros[type].consumed / total) * 251.2;
    const stroke = {
      protein: 'stroke-chart-protein',
      carbs: 'stroke-chart-carbs',
      fats: 'stroke-chart-fats',
    }[type];

    return (
      <circle
        key={type}
        cx="50" cy="50" r="40"
        strokeWidth="12" fill="none"
        strokeDasharray={`${pct} 251.2`}
        strokeDashoffset={`-${offset}`}
        className={clsx(stroke)}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">Macronutrients</h3>
        <Icon name="PieChart" size={16} className="text-nutri-primary" />
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="40"
              strokeWidth="12" fill="none"
              className="stroke-chart-bg"
            />
            {segments}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-text-secondary">Balance</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {legend.map(({ key, label, bg }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={clsx('w-3 h-3 rounded-full', bg)} />
              <span className="text-xs text-text-secondary">{label}</span>
            </div>
            <span className="text-xs font-data text-text-primary">
              {macros[key].consumed}{macros[key].unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
