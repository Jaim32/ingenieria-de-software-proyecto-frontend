import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import IngredientCategory from './components/IngredientCategory';
import MealSummaryPanel from './components/MealSummaryPanel';
import TabNavigation from './components/TabNavigation';

// Definiciones estáticas de categorías (colores, iconos, etc.)
const categoryDefinitions = {
  proteins: {
    title: 'Proteins',
    icon: '🥩',
    color: 'text-red-600',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50'
  },
  carbohydrates: {
    title: 'Carbohydrates',
    icon: '🍞',
    color: 'text-amber-600',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50'
  },
  vegetables: {
    title: 'Vegetables',
    icon: '🥬',
    color: 'text-green-600',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50'
  }
};

const categoryQueries = {
  proteins: 'protein',
  carbohydrates: 'carbohydrate',
  vegetables: 'vegetable'
};

const PAGE_SIZE = 4;

const CalorieTrackingDashboard = () => {
  const location = useLocation();
  const mealType = location.state?.mealType || '';

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState('proteins');
  const [ingredientsData, setIngredientsData] = useState({
    proteins: [],
    carbohydrates: [],
    vegetables: []
  });
  const [pageNumbers, setPageNumbers] = useState({
    proteins: 1,
    carbohydrates: 1,
    vegetables: 1
  });
  const [hasMore, setHasMore] = useState({
    proteins: true,
    carbohydrates: true,
    vegetables: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategoryPage = useCallback(async (key, page) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_FDC_BASE_URL}/foods/search?api_key=${import.meta.env.VITE_FDC_API_KEY}` +
        `&query=${encodeURIComponent(categoryQueries[key])}` +
        `&pageSize=${PAGE_SIZE}&pageNumber=${page}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      const foods = json.foods || [];
      const mapped = foods.map(food => ({
        id: food.fdcId,
        name: food.description,
        calories: food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0,
        protein: food.foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0,
        carbs: food.foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
        fiber: food.foodNutrients.find(n => n.nutrientName === 'Fiber, total dietary')?.value || 0,
        sodium: food.foodNutrients.find(n => n.nutrientName === 'Sodium, Na')?.value || 0,
        potassium: food.foodNutrients.find(n => n.nutrientName === 'Potassium, K')?.value || 0,
        vitaminC: food.foodNutrients.find(n => n.nutrientName === 'Vitamin C, total ascorbic acid')?.value || 0,
        serving: food.servingSize && food.servingSizeUnit ? `${food.servingSize} ${food.servingSizeUnit}` : ''
      }));
      setIngredientsData(prev => ({
        ...prev,
        [key]: page === 1 ? mapped : [...prev[key], ...mapped]
      }));
      if (foods.length < PAGE_SIZE) setHasMore(prev => ({ ...prev, [key]: false }));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Object.keys(categoryQueries).forEach(key => fetchCategoryPage(key, 1));
  }, [fetchCategoryPage]);

  const handleScroll = (e, key) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 100 && hasMore[key] && !loading) {
      const nextPage = pageNumbers[key] + 1;
      setPageNumbers(prev => ({ ...prev, [key]: nextPage }));
      fetchCategoryPage(key, nextPage);
    }
  };

  const handleIngredientUpdate = (ingredient, quantity) => {
    setSelectedIngredients(prev => {
      const idx = prev.findIndex(item => item.id === ingredient.id);
      if (idx >= 0) {
        if (quantity === 0) return prev.filter(item => item.id !== ingredient.id);
        const copy = [...prev];
        copy[idx] = { ...ingredient, quantity };
        return copy;
      }
      if (quantity > 0) return [...prev, { ...ingredient, quantity }];
      return prev;
    });
  };

  const getIngredientQuantity = id =>
    selectedIngredients.find(ing => ing.id === id)?.quantity || 0;

  const calculateTotalNutrition = () =>
    selectedIngredients.reduce(
      (totals, ing) => ({
        calories: totals.calories + ing.calories * ing.quantity,
        protein: totals.protein + ing.protein * ing.quantity,
        carbs: totals.carbs + ing.carbs * ing.quantity,
        fiber: totals.fiber + (ing.fiber || 0) * ing.quantity,
        sodium: totals.sodium + (ing.sodium || 0) * ing.quantity,
        potassium: totals.potassium + (ing.potassium || 0) * ing.quantity,
        vitaminC: totals.vitaminC + (ing.vitaminC || 0) * ing.quantity
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fiber: 0,
        sodium: 0,
        potassium: 0,
        vitaminC: 0
      }
    );

  const getCategoryTotals = key =>
    selectedIngredients
      .filter(item => ingredientsData[key].some(ing => ing.id === item.id))
      .reduce(
        (totals, ing) => ({
          calories: totals.calories + ing.calories * ing.quantity,
          protein: totals.protein + ing.protein * ing.quantity,
          carbs: totals.carbs + ing.carbs * ing.quantity
        }),
        { calories: 0, protein: 0, carbs: 0 }
      );

  const handleClearAll = () => setSelectedIngredients([]);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full min-h-screen bg-white relative overflow-x-hidden">
      <div
        className="w-full min-h-screen py-8 px-6 md:px-12"
        style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f9fafb 100%)'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 h-[600px] space-y-6">
            {Object.entries(categoryDefinitions).map(([key, def]) => (
              <IngredientCategory
                key={key}
                categoryKey={key}
                category={{ ...def, ingredients: ingredientsData[key] }}
                selectedIngredients={selectedIngredients}
                onIngredientUpdate={handleIngredientUpdate}
                getIngredientQuantity={getIngredientQuantity}
                getCategoryTotals={() => getCategoryTotals(key)}
                isExpanded={expandedCategory === key}
                onToggleExpand={() =>
                  setExpandedCategory(expandedCategory === key ? null : key)
                }
                onScrollCategory={(e, key) => handleScroll(e, key)}
              />
            ))}
            {loading && <p className="text-center py-2">Cargando más ingredientes...</p>}
          </div>
          <div className="lg:col-span-1">
            <MealSummaryPanel
              mealType={mealType}
              selectedIngredients={selectedIngredients}
              totalNutrition={calculateTotalNutrition()}
              categoryColors={{
                proteins: 'bg-red-600',
                carbohydrates: 'bg-amber-600',
                vegetables: 'bg-green-600'
              }}
              ingredientCategories={categoryDefinitions}
              ingredientsData={ingredientsData}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTrackingDashboard;
