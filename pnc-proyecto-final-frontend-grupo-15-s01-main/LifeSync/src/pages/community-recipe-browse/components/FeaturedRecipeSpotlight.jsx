import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function FeaturedRecipeSpotlight({ recipe, onRecipeClick }) {
  if (!recipe) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Featured Recipe</h2>
      
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        onClick={() => onRecipeClick(recipe)}
      >
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-80 overflow-hidden">
              <Image
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={recipe.authorAvatar}
                alt={recipe.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-slate-800">{recipe.author}</p>
                <p className="text-sm text-gray-500">Chef</p>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              {recipe.title}
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {recipe.description}
            </p>

            

            {/* Action Button */}
            <button className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-orange-600 hover:shadow-lg flex items-center justify-center space-x-2">
              <Icon name="Eye" size={18} />
              <span>View Full Recipe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedRecipeSpotlight;