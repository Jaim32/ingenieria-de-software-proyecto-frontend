import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function RecipeCard({ recipe, onClick }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={() => onClick(recipe)}
    >
      {/* Imagen de la receta */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={`http://localhost:4029${recipe.imagen}`} // Usa el path correcto
          alt={recipe.descripcion}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
            <Icon name="Utensils" size={14} className="text-orange-500" />
            <span className="text-xs font-medium text-slate-800">{recipe.tipoDeComida || 'Comida'}</span>
          </div>
        </div>
      </div>

      {/* Contenido de la receta */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
          {recipe.descripcion}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.procedimiento}
        </p>

        {/* Metadatos (puedes personalizar más) */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Drumstick" size={14} />
            <span>{recipe.proteina}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Leaf" size={14} />
            <span>{recipe.vegetales}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Soup" size={14} />
            <span>{recipe.carbohidratos}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
