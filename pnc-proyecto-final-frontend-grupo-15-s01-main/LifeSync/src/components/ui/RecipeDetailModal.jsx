import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';


function RecipeDetailModal({ isOpen, onClose, recipe }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const params = new URLSearchParams(location.search);
      params.set('recipe', recipe?.idReceta?.toString() || 'preview');
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else {
      document.body.style.overflow = 'unset';
      const params = new URLSearchParams(location.search);
      params.delete('recipe');
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, recipe?.idReceta, location.pathname, navigate]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !recipe) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-card shadow-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto z-modal">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border-color p-4 flex items-center justify-between">
          <h2 className="font-heading font-heading-bold text-xl text-text-primary truncate pr-4">
            {recipe.nombre || 'Recipe Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-smooth flex-shrink-0"
            aria-label="Close modal"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Recipe Image */}
          {recipe.imagen && (
            <div className="mb-6">
              <Image
                src={recipe.imagen}
                alt={recipe.nombre}
                className="w-full h-64 md:h-80 object-cover rounded-card"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-heading text-lg text-text-primary mb-3">Description</h3>
            <p className="text-text-secondary leading-relaxed">
              {recipe.descripcion || 'N/A'}
            </p>
          </div>

          {/* Ingredient Details */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-heading text-md text-text-primary">Proteins</h4>
              <p><strong>Type:</strong> {recipe.proteina}</p>
              <p><strong>Cut:</strong> {recipe.corteProteina}</p>
              <p><strong>Portion:</strong> {recipe.porcionProteina}</p>
              <p><strong>Cooking Method:</strong> {recipe.coccionProteina}</p>
            </div>
            <div>
              <h4 className="font-heading text-md text-text-primary">Vegetables</h4>
              <p><strong>Type:</strong> {recipe.vegetales}</p>
              <p><strong>Portion:</strong> {recipe.porcionVegetales}</p>
              <p><strong>Cooking Method:</strong> {recipe.coccionVegetales}</p>
            </div>
            <div>
              <h4 className="font-heading text-md text-text-primary">Carbohydrates</h4>
              <p><strong>Type:</strong> {recipe.carbohidratos}</p>
              <p><strong>Portion:</strong> {recipe.porcionCarbohidratos}</p>
              <p><strong>Cooking Method:</strong> {recipe.coccionCarbohidratos}</p>
            </div>
            <div>
              <h4 className="font-heading text-md text-text-primary">Meal Type</h4>
              <p>{recipe.tipoDeComida || 'N/A'}</p>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="mb-6">
            <h3 className="font-heading text-lg text-text-primary mb-3">Complete Ingredients List</h3>
            <p className="text-text-secondary whitespace-pre-wrap">
              {recipe.ingredientesLista || 'N/A'}
            </p>
          </div>

          {/* Procedure */}
          <div className="mb-6">
            <h3 className="font-heading text-lg text-text-primary mb-3">Procedure</h3>
            <p className="text-text-secondary whitespace-pre-wrap">
              {recipe.procedimiento || 'N/A'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-color">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition hover:bg-opacity-90">
              <Icon name="Heart" size={18} />
              <span>Save Recipe</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-surface text-text-primary rounded-lg font-medium transition hover:bg-border-color">
              <Icon name="Share2" size={18} />
              <span>Share</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-surface text-text-primary rounded-lg font-medium transition hover:bg-border-color">
              <Icon name="MessageCircle" size={18} />
              <span>Comment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;
