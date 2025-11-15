import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Icon from 'components/AppIcon';
import FeaturedRecipeSpotlight from './components/FeaturedRecipeSpotlight';
import RecipeCard from './components/RecipeCard';
import FilterChips from './components/FilterChips';
import RecipeDetailModal from 'components/ui/RecipeDetailModal';

function CommunityRecipeBrowse() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [searchText, setSearchText] = useState('');

  const filterOptions = [
    { id: 'all', label: 'All Recipes', icon: 'Grid3X3' },
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'meat', label: 'Meat', icon: 'Beef' },
    { id: 'seafood', label: 'Seafood', icon: 'Fish' },
    { id: 'asian', label: 'Asian', icon: 'Globe' },
    { id: 'dessert', label: 'Desserts', icon: 'Cookie' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8082/api/recetas/publicas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        let data = Array.isArray(res.data) ? res.data : [];

        const validRecipes = data.filter((r, i) => {
          if (!r.idReceta) {
            console.warn(`❌ Receta descartada sin idReceta (#${i})`, r);
            return false;
          }
          return true;
        });

        // Obtener info del autor para cada receta
        const enrichedRecipes = await Promise.all(validRecipes.map(async (recipe) => {
          try {
            const userRes = await axios.get(`http://localhost:8082/api/usuarios/getById?idUsuario=${recipe.id_Usuario}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const user = userRes.data?.data || {};
            return {
              ...recipe,
              author: user.nombre || 'Desconocido',
              authorAvatar: user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
            };
          } catch (error) {
            console.error('Error al obtener autor de receta', error);
            return {
              ...recipe,
              author: 'Desconocido',
              authorAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
            };
          }
        }));

        setCommunityRecipes(enrichedRecipes);

        // Elegir receta aleatoria
        if (enrichedRecipes.length > 0) {
          const random = enrichedRecipes[Math.floor(Math.random() * enrichedRecipes.length)];
          setFeaturedRecipe({
            ...random,
            title: random.nombre,
            description: random.descripcion,
            image: random.imagen || 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
            author: random.author,
            authorAvatar: random.authorAvatar,
            cookTime: random.tiempoPreparacion || 'N/A',
            servings: random.porciones || 'N/A',
            difficulty: random.dificultad || 'N/A',
            rating: random.rating || 'N/A'
          });
        }
      })
      .catch(err => {
        console.error('Error fetching approved recipes', err);
        setCommunityRecipes([]);
      });
  }, []);

  const filteredRecipes = Array.isArray(communityRecipes)
    ? communityRecipes.filter(r => {
        const matchesFilter = activeFilter === 'all' || r.tipoDeComida?.toLowerCase() === activeFilter;
        const matchesSearch = r.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
                              r.descripcion?.toLowerCase().includes(searchText.toLowerCase());
        return matchesFilter && matchesSearch;
      })
    : [];

  const handleRecipeClick = (recipe) => {
    if (!recipe.idReceta) return;
    navigate(`/community-recipe-browse?recipe=${recipe.idReceta}`);
  };

  const handleCloseModal = () => {
    navigate('/community-recipe-browse');
  };

  const toggleMobileMenu = () => setMobileMenu(!isMobileMenuOpen);

  useEffect(() => {
    const recipeId = searchParams.get('recipe');
    if (!recipeId) {
      setIsModalOpen(false);
      setSelectedRecipe(null);
      return;
    }

    if (communityRecipes.length > 0) {
      const recipe = communityRecipes.find(r => r.idReceta?.toString() === recipeId);
      if (recipe) {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, communityRecipes]);

  return (
    <div className="theme-recipe min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Discover Amazing Recipes</h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore thousands of recipes shared by our community of passionate home cooks and professional chefs.
          </p>
          <Link
            to="/recipe-creation-form"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold text-lg transition hover:bg-orange-600 hover:shadow-lg transform hover:scale-105"
          >
            <Icon name="Plus" size={20} />
            <span>Share Your Recipe</span>
          </Link>
        </div>

        {featuredRecipe && (
          <FeaturedRecipeSpotlight recipe={featuredRecipe} onRecipeClick={handleRecipeClick} />
        )}

        <FilterChips filters={filterOptions} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <div className="my-4">
          <input
            type="text"
            placeholder="Search recipes by name or description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((r) => (
            <RecipeCard
              key={`recipe-${r.idReceta}`}
              recipe={r}
              onClick={() => handleRecipeClick(r)}
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or explore all recipes.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
            >
              Show All Recipes
            </button>
          </div>
        )}
      </main>

      <Link
        to="/recipe-creation-form"
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition md:hidden"
        aria-label="Create new recipe"
      >
        <Icon name="Plus" size={24} />
      </Link>

      <RecipeDetailModal isOpen={isModalOpen} onClose={handleCloseModal} recipe={selectedRecipe} />
    </div>
  );
}

export default CommunityRecipeBrowse;
