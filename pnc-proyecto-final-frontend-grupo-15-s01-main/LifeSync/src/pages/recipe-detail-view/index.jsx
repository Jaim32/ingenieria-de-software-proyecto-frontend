import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import NavigationHeader from 'components/ui/NavigationHeader';

function RecipeDetailView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('id');
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetch(`http://localhost:8082/recetas/${recipeId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch recipe');
          }
          return res.json();
        })
        .then((data) => setRecipe(data))
        .catch((err) => {
          console.error(err);
          setRecipe(null);
        });
    }
  }, [recipeId]);

  const handleBack = () => {
    navigate('/community-recipe-browse');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.titulo,
        text: recipe?.descripcion,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  if (!recipe) {
    return (
      <div className="theme-recipe min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-recipe min-h-screen bg-white">
      <NavigationHeader />
      <div className="p-4 max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-4 text-orange-600 hover:underline"
        >
          ← Back to recipes
        </button>

        <h1 className="text-3xl font-bold mb-2">{recipe.titulo}</h1>
        <p className="text-gray-600 mb-4">{recipe.descripcion}</p>

        {recipe.imagenUrl && (
          <Image
            src={recipe.imagenUrl}
            alt={recipe.titulo}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {recipe.proteinas?.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Proteínas</h2>
              <ul className="list-disc list-inside">
                {recipe.proteinas.map((p, i) => (
                  <li key={i}>{p.nombre} - {p.peso} ({p.tipoDeCoccion})</li>
                ))}
              </ul>
            </div>
          )}

          {recipe.verduras?.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Verduras</h2>
              <ul className="list-disc list-inside">
                {recipe.verduras.map((v, i) => (
                  <li key={i}>{v.nombre} - {v.peso} ({v.tipoDeCoccion})</li>
                ))}
              </ul>
            </div>
          )}

          {recipe.carbohidratos?.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Carbohidratos</h2>
              <ul className="list-disc list-inside">
                {recipe.carbohidratos.map((c, i) => (
                  <li key={i}>{c.nombre} - {c.peso} ({c.tipoDeCoccion})</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {recipe.ingredientes && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Ingredientes</h2>
            <p className="whitespace-pre-wrap text-gray-700">{recipe.ingredientes}</p>
          </div>
        )}

        {recipe.instrucciones?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Instrucciones</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              {recipe.instrucciones.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg font-medium ${isSaved ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-800'}`}
          >
            <Icon name="Heart" size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
          >
            <Icon name="Share2" size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailView;
