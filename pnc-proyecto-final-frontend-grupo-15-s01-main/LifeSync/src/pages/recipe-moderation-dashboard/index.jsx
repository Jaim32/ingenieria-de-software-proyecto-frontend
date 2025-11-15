import React, { useState, useEffect } from 'react';
import axios from 'axios';

import RecipeQueue from './components/RecipeQueue';
import RecipeDetailPanel from './components/RecipeDetailPanel';
import DashboardHeader from './components/DashboardHeader';


const RecipeModerationDashboard = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isQueueVisible, setIsQueueVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [recipes, setRecipes] = useState([]);
  const [userRole, setUserRole] = useState(null); // NUEVO

  // Extraer el rol desde el token JWT
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      const role = parsed?.rol;
setUserRole(role === 'CATADOR' ? 'CATADOR' : 'USER');

    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }
}, []);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8082/api/recetas/pendientes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const recetas = response.data;

        const recetasConUsuarios = await Promise.all(
          recetas.map(async (r) => {
            let authorName = 'Desconocido';
            try {
              const userResp = await axios.get(`http://localhost:8082/api/usuarios/getById?idUsuario=${r.id_Usuario}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              authorName = userResp.data.data.nombre;
            } catch (err) {
              console.error('Error obteniendo usuario:', err);
            }

            return {
              ...r,
              image: r.imagen || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop',
              author: {
                name: authorName
              },
              flags: r.flags || []
            };
          })
        );

        setRecipes(recetasConUsuarios);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsQueueVisible(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'priority' && recipe.priority === 'high') ||
      (activeFilter === 'flagged' && recipe.flags?.length > 0);

    return matchesSearch && matchesFilter;
  });

  const toggleQueue = () => {
    setIsQueueVisible(!isQueueVisible);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    if (isMobile) {
      setIsQueueVisible(false);
    }
  };

  const handleRecipeAction = async (action, recipeId) => {
    if (action === 'approve') {
      if (userRole !== 'CATADOR') {
        alert('Solo los usuarios con rol CATADOR pueden aprobar recetas.');
        return;
      }

      try {
        const response = await axios.put(`http://localhost:8082/api/recetas/${recipeId}/aprobacion`, {
          aprobada: true
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('✅ Receta aprobada:', response.data);
        setRecipes(prev => prev.filter(r => r.idReceta !== recipeId));
        setSelectedRecipe(null);
      } catch (error) {
        console.error('❌ Error al aprobar receta:', error);
      }
    }
  };

  return (
    <div className="theme-taster min-h-screen bg-background pt-20">
      <DashboardHeader />

      <main className="flex h-[calc(100vh-8rem)]">
        <div
          className={`
            ${isMobile ? 'fixed inset-y-32 left-0 z-400' : 'relative'}
            ${isQueueVisible ? 'w-full lg:w-[30%]' : 'w-0'}
            ${isMobile && !isQueueVisible ? 'translate-x-[-100%]' : 'translate-x-0'}
            bg-surface border-r border-border transition-all duration-300 ease-out
            ${isMobile ? 'shadow-large' : ''}
          `}
        >
          {isQueueVisible && (
            <RecipeQueue
              recipes={filteredRecipes}
              selectedRecipe={selectedRecipe}
              onRecipeSelect={handleRecipeSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onClose={isMobile ? toggleQueue : null}
              totalCount={recipes.length}
              priorityCount={recipes.filter(r => r.priority === 'high').length}
              flaggedCount={recipes.filter(r => r.flags?.length > 0).length}
            />
          )}
        </div>

        <div className={`flex-1 ${isMobile && isQueueVisible ? 'hidden' : 'block'}`}>
          <RecipeDetailPanel
            recipe={selectedRecipe}
            onToggleQueue={!isQueueVisible ? toggleQueue : null}
            onRecipeAction={handleRecipeAction}
          />
        </div>

        {isMobile && isQueueVisible && (
          <div
            className="fixed inset-0 bg-black/50 z-300"
            onClick={toggleQueue}
          />
        )}
      </main>
    </div>
  );
};

export default RecipeModerationDashboard;
