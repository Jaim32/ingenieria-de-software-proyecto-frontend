import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from 'components/ui/NavigationHeader';
import Icon from 'components/AppIcon';

import RecipeNameSection from './components/RecipeNameSection';
import IngredientCategorySection from './components/IngredientCategorySection';
import RecipeDetailsSection from './components/RecipeDetailsSection';
import ImageUploadSection from './components/ImageUploadSection';

function RecipeCreationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipeName: '',
    proteins: { type: '', weight: '', cookingMethod: '' },
    vegetables: { type: '', weight: '', cookingMethod: '' },
    carbohydrates: { type: '', weight: '', cookingMethod: '' },
    ingredientsList: '',
    cookingSteps: '',
    tipoDeComida: '',
    recipeImage: null,
    imagePreview: null,
    imagePath: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipeName.trim()) {
      newErrors.recipeName = 'Recipe name is required';
    }

    if (!formData.ingredientsList.trim()) {
      newErrors.ingredientsList = 'Ingredients list is required';
    }

    if (!formData.cookingSteps.trim()) {
      newErrors.cookingSteps = 'Cooking steps are required';
    }

    if (!formData.tipoDeComida.trim()) {
      newErrors.tipoDeComida = 'Meal type is required';
    }

    const hasIngredients = formData.proteins.type || formData.vegetables.type || formData.carbohydrates.type;
    if (!hasIngredients) {
      newErrors.ingredients = 'Please select at least one ingredient category';
    }

    if (!formData.imagePath) {
      newErrors.image = 'Please upload an image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCategoryChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));

    if (errors.ingredients && value) {
      setErrors(prev => ({
        ...prev,
        ingredients: ''
      }));
    }
  };

  const handleImageUpload = async (file, previewUrl) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);

    try {
      const res = await fetch("http://localhost:4029/uploads", {
        method: "POST",
        body: formDataImg,
      });

      const data = await res.json();
      const ruta = data.imagePath;

      setFormData((prev) => ({
        ...prev,
        imagePreview: previewUrl,
        imagePath: ruta,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const payload = {
nombre: formData.recipeName,
        proteina: formData.proteins.type,
        corteProteina: formData.proteins.cookingMethod,
        porcionProteina: formData.proteins.weight,
        coccionProteina: formData.proteins.cookingMethod,
        carbohidratos: formData.carbohydrates.type,
        porcionCarbohidratos: formData.carbohydrates.weight,
        coccionCarbohidratos: formData.carbohydrates.cookingMethod,
        vegetales: formData.vegetables.type,
        porcionVegetales: formData.vegetables.weight,
        coccionVegetales: formData.vegetables.cookingMethod,
descripcion: formData.recipeName,
        procedimiento: formData.cookingSteps,
        imagen: formData.imagePath ?? '',
        tipoDeComida: formData.tipoDeComida,
        idUsuario: user?.idUsuario,
        ingredientesLista: formData.ingredientsList,
        aprobado: false
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recetas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Recipe published successfully!");
        navigate("/community-recipe-browse");
      } else {
        const err = await response.json();
        console.error("Error del backend:", err);
        alert("Failed to publish recipe.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to publish recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="theme-recipe min-h-screen bg-background">
      <NavigationHeader />
      <div className="pt-16">
        <div className="bg-background border-b border-border-color sticky top-16 z-dropdown">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/community-recipe-browse')}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="ArrowLeft" size={20} />
                <span className="font-body font-body-medium">Back to Browse</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-body font-body-medium transition-smooth hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} />
                    <span>Publish Recipe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-heading font-heading-bold text-3xl text-text-primary mb-2">
              Share Your Recipe
            </h1>
            <p className="font-body font-body-normal text-text-secondary">
              Create and share your culinary masterpiece with the community
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <RecipeNameSection
              value={formData.recipeName}
              onChange={(value) => handleInputChange('recipeName', value)}
              error={errors.recipeName}
            />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-heading-semibold text-xl text-text-primary">
                  Ingredient Categories
                </h2>
                {errors.ingredients && (
                  <span className="text-error text-sm font-body font-body-medium">
                    {errors.ingredients}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <IngredientCategorySection
                  title="Proteins"
                  icon="Beef"
                  category="proteins"
                  data={formData.proteins}
                  onChange={handleCategoryChange}
                />
                <IngredientCategorySection
                  title="Vegetables"
                  icon="Carrot"
                  category="vegetables"
                  data={formData.vegetables}
                  onChange={handleCategoryChange}
                />
                <IngredientCategorySection
                  title="Carbohydrates"
                  icon="Wheat"
                  category="carbohydrates"
                  data={formData.carbohydrates}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecipeDetailsSection
                ingredientsList={formData.ingredientsList}
                cookingSteps={formData.cookingSteps}
                mealType={formData.tipoDeComida}
                onIngredientsChange={(value) => handleInputChange('ingredientsList', value)}
                onStepsChange={(value) => handleInputChange('cookingSteps', value)}
                onMealTypeChange={(value) => handleInputChange('tipoDeComida', value)}
                ingredientsError={errors.ingredientsList}
                stepsError={errors.cookingSteps}
                mealTypeError={errors.tipoDeComida}
              />
              <ImageUploadSection
                imagePreview={formData.imagePreview}
                onImageUpload={handleImageUpload}
              />
              {errors.image && (
                <p className="text-error text-sm font-body font-body-medium">
                  {errors.image}
                </p>
              )}
            </div>
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-white rounded-lg font-body font-body-medium transition-smooth hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    <span>Publishing Recipe...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={20} />
                    <span>Publish Recipe</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeCreationForm;
