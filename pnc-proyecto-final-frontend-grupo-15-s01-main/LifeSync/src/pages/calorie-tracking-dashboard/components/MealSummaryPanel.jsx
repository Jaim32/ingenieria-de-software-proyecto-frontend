import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import NutritionalSummary from './NutritionalSummary';
import MacronutrientBars from './MacronutrientBars';
import MicronutrientInfo from './MicronutrientInfo';
import Button from '../../../components/ui/Button';

const MealSummaryPanel = ({
  mealType,
  selectedIngredients,
  totalNutrition,
  categoryColors,
  ingredientCategories,
  ingredientsData,
  onClearAll
}) => {
  const navigate = useNavigate(); // ✅ Hook de navegación

 const handleSaveMeal = async () => {
  if (!mealType) {
    alert("Meal type not selected.");
    return;
  }

  const idUsuario = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!idUsuario || !token) {
    alert("Usuario no autenticado. Faltan credenciales.");
    return;
  }

  // Buscar nombres
  const proteina = selectedIngredients.find(ing =>
    ingredientsData.proteins.some(p => p.id === ing.id)
  )?.name || '';

  const carbohidrato = selectedIngredients.find(ing =>
    ingredientsData.carbohydrates.some(c => c.id === ing.id)
  )?.name || '';

  const vegetal = selectedIngredients.find(ing =>
    ingredientsData.vegetables.some(v => v.id === ing.id)
  )?.name || '';

  // Calcular cantidades en gramos (cX)
  const cProteina = selectedIngredients
    .filter(ing => ingredientsData.proteins.some(p => p.id === ing.id))
    .reduce((sum, ing) => sum + ing.quantity, 0);

  const cCarbohidrato = selectedIngredients
    .filter(ing => ingredientsData.carbohydrates.some(c => c.id === ing.id))
    .reduce((sum, ing) => sum + ing.quantity, 0);

  const cVegetal = selectedIngredients
    .filter(ing => ingredientsData.vegetables.some(v => v.id === ing.id))
    .reduce((sum, ing) => sum + ing.quantity, 0);

  const dto = {
    meal: mealType,
    proteina,
    carbohidrato,
    vegetal,
    caloriasTotales: Math.round(totalNutrition.calories),
    cProteina,
    cCarbohidrato,
    cVegetal,
    fecha: new Date().toISOString().split('T')[0],
    idUsuario
  };

  try {
    const res = await fetch('http://localhost:8082/api/platillos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dto)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error ${res.status}: ${errText}`);
    }

    alert('Platillo guardado exitosamente');
    onClearAll();

    navigate('/daily-nutrition-overview-dashboard');

  } catch (err) {
    console.error(err);
    alert('Error al guardar platillo');
  }
};


  const calculateCategoryDistribution = () => {
    const distribution = {};
    const categoryKeys = Object.keys(ingredientCategories);
    categoryKeys.forEach(categoryKey => {
      const categoryIngredients = selectedIngredients.filter(
        item => ingredientsData[categoryKey].some(ing => ing.id === item.id)
      );
      const totalCalories = categoryIngredients.reduce(
        (total, ingredient) => total + ingredient.calories * ingredient.quantity,
        0
      );
      distribution[categoryKey] = {
        calories: totalCalories,
        percentage: totalNutrition.calories > 0
          ? (totalCalories / totalNutrition.calories) * 100
          : 0
      };
    });
    return distribution;
  };

  const categoryDistribution = calculateCategoryDistribution();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Meal Summary</h3>
      {selectedIngredients.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-500 text-sm">
            Start building your meal by selecting ingredients from the categories
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Category Distribution</h4>
            <div className="h-4 w-full rounded-full overflow-hidden bg-gray-100 mb-2">
              {Object.entries(categoryDistribution).map(([category, data]) => (
                data.percentage > 0 && (
                  <div
                    key={category}
                    className={`h-full ${categoryColors[category]} inline-block`}
                    style={{ width: `${data.percentage}%` }}
                  />
                )
              ))}
            </div>
            <div className="flex flex-wrap gap-y-2 text-xs text-gray-600">
              {Object.entries(categoryDistribution).map(([category, data]) => (
                data.calories > 0 && (
                  <div key={category} className="flex items-center mr-4">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[category]} mr-1`} />
                    <span>
                      {ingredientCategories[category].title}: {data.calories.toFixed(0)} kcal
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>

          <NutritionalSummary totalNutrition={totalNutrition} />
          <MacronutrientBars totalNutrition={totalNutrition} />
          <MicronutrientInfo totalNutrition={totalNutrition} />

          <div className="space-y-3 mt-6">
            <Button onClick={handleSaveMeal} className="w-full" size="medium">
              Save Meal
            </Button>
            <Button onClick={onClearAll} variant="outline" className="w-full" size="medium">
              Clear All
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

MealSummaryPanel.propTypes = {
  mealType: PropTypes.string.isRequired,
  selectedIngredients: PropTypes.array.isRequired,
  totalNutrition: PropTypes.object.isRequired,
  categoryColors: PropTypes.object.isRequired,
  ingredientCategories: PropTypes.object.isRequired,
  ingredientsData: PropTypes.object.isRequired,
  onClearAll: PropTypes.func.isRequired
};

export default MealSummaryPanel;
