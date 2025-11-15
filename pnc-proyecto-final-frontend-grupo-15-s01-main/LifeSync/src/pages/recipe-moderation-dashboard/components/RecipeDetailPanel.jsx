import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RecipeDetailPanel = ({ recipe, onToggleQueue, onRecipeAction }) => {
  if (!recipe) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-border bg-surface">
          <div className="flex items-center space-x-4">
            {onToggleQueue && (
              <button
                onClick={onToggleQueue}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-micro"
              >
                <Icon name="Menu" size={20} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-text-primary font-heading">
              Recipe Review
            </h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <Icon name="FileText" size={64} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2 font-heading">
              Select a Recipe to Review
            </h3>
            <p className="text-text-secondary">
              Choose a recipe from the queue to begin the review process and see detailed information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onToggleQueue && (
              <button
                onClick={onToggleQueue}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-micro"
              >
                <Icon name="Menu" size={20} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-text-primary font-heading">
                {recipe.nombre || 'Sin título'}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-text-secondary">
                  {recipe.author?.name ? `Por ${recipe.author.name}` : 'Autor desconocido'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRecipeAction('reject', recipe.idReceta)}
              className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-micro text-sm font-medium"
            >
              <Icon name="X" size={16} className="mr-1" />
              Rechazar
            </button>
            <button
              onClick={() => onRecipeAction('approve', recipe.idReceta)}
              className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-micro text-sm font-medium"
            >
              <Icon name="Check" size={16} className="mr-1" />
              Aprobar
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Imagen */}
        {recipe.imagen && (
          <div className="aspect-video rounded-lg overflow-hidden shadow border border-border">
            <Image
              src={recipe.imagen}
              alt={recipe.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Sección de detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Proteína</h3>
            <p><strong>Tipo:</strong> {recipe.proteina}</p>
            <p><strong>Corte:</strong> {recipe.corteProteina}</p>
            <p><strong>Porción:</strong> {recipe.porcionProteina}</p>
            <p><strong>Cocción:</strong> {recipe.coccionProteina}</p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-2">Carbohidratos</h3>
            <p><strong>Tipo:</strong> {recipe.carbohidratos}</p>
            <p><strong>Porción:</strong> {recipe.porcionCarbohidratos}</p>
            <p><strong>Cocción:</strong> {recipe.coccionCarbohidratos}</p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-2">Vegetales</h3>
            <p><strong>Tipo:</strong> {recipe.vegetales}</p>
            <p><strong>Porción:</strong> {recipe.porcionVegetales}</p>
            <p><strong>Cocción:</strong> {recipe.coccionVegetales}</p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-2">Tipo de Comida</h3>
            <p>{recipe.tipoDeComida || 'No especificado'}</p>
          </div>
        </div>

        {/* Lista de ingredientes */}
        {recipe.ingredientesLista && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Ingredientes Adicionales</h3>
            <p>{recipe.ingredientesLista}</p>
          </div>
        )}

        {/* Descripción */}
        {recipe.descripcion && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Descripción</h3>
            <p>{recipe.descripcion}</p>
          </div>
        )}

        {/* Procedimiento */}
        {recipe.procedimiento && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Instrucciones</h3>
            <p>{recipe.procedimiento}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPanel;