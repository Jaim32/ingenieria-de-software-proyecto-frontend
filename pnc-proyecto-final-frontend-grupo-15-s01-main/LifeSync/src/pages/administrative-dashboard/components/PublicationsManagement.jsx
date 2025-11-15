import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import axios from 'axios';
import RecipeDetailModal from 'components/ui/RecipeDetailModal';

const PublicationsManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const pageSize = 8;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8082/api/recetas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recipesData = response.data;

        // Obtener todos los IDs de usuario únicos
        const userIds = [...new Set(recipesData.map(r => r.usuario?.idUsuario).filter(Boolean))];

        // Mapear cada ID a su nombre
        const userMap = {};
        await Promise.all(userIds.map(async (id) => {
          try {
            const userRes = await axios.get(`http://localhost:8082/api/usuarios/getById?idUsuario=${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            userMap[id] = userRes.data.nombre;
          } catch (err) {
            userMap[id] = 'Desconocido';
          }
        }));

        const adapted = recipesData.map((r) => {
          const nombreUsuario = userMap[r.usuario?.idUsuario] || 'Desconocido';
          return {
            id: r.idReceta,
            title: r.nombre,
            author: nombreUsuario,
            authorAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder, replace with actual avatar if available
            status: r.aprobada ? 'live' : 'pending',
            publishDate: r.fecha || null,
            rating: Math.floor(Math.random() * 2) + 4.0,
            reviews: Math.floor(Math.random() * 200),
            category: r.tipoDeComida || 'General',
            thumbnail: r.imagen || 'https://via.placeholder.com/300x200?text=Receta',
            description: r.descripcion || '',
            fullData: r,
          }
        });

        setRecipes(adapted);
        setTotalPages(Math.ceil(adapted.length / pageSize));
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setIsConfirmOpen(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8082/api/recetas/${recipeToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Ocurrió un error al eliminar la receta');
    } finally {
      setIsConfirmOpen(false);
      setRecipeToDelete(null);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      (recipe.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (recipe.author?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (recipe.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || recipe.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const maxPages = Math.ceil(filteredRecipes.length / pageSize);
    if (currentPage > maxPages) setCurrentPage(Math.max(1, maxPages));
  }, [filteredRecipes, pageSize, currentPage]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      live: 'status-badge status-success',
      draft: 'status-badge status-warning',
      pending: 'status-badge bg-accent-100 text-accent-700',
    };
    return statusClasses[status] || 'status-badge';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      live: 'CheckCircle',
      draft: 'Edit',
      pending: 'Clock',
    };
    return statusIcons[status] || 'FileText';
  };

  const Pagination = () => {
    const totalFilteredPages = Math.ceil(filteredRecipes.length / pageSize);

    return (
      <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
        <div className="text-sm text-text-secondary">
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRecipes.length)} of {filteredRecipes.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          {Array.from({ length: totalFilteredPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages))}
            disabled={currentPage === totalFilteredPages}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="shimmer">
          <div className="skeleton h-24 w-full rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Publications Management</h2>
          <p className="text-sm text-text-secondary mt-1">{filteredRecipes.length} recipes found</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field text-sm py-2"
        >
          <option value="all">All Status</option>
          <option value="live">Live</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search recipes by title, author, or category..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field pl-10"
        />
      </div>

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : paginatedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="BookOpen" size={32} color="#64748B" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No recipes found</h3>
            <p className="text-text-secondary">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No recipes available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedRecipes.map((recipe) => (
              <div key={recipe.id} className="card hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                    <Image src={recipe.thumbnail} alt={recipe.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-text-primary truncate">{recipe.title}</h3>
                          <span className={getStatusBadge(recipe.status)}>
                            <Icon name={getStatusIcon(recipe.status)} size={12} className="mr-1" />
                            {recipe.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary-100">
                            <Image src={recipe.authorAvatar} alt={recipe.author} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm text-text-secondary">by {recipe.author}</span>
                          <span className="text-xs text-text-secondary">•</span>
                          <span className="text-xs text-text-secondary">{recipe.category}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-text-secondary">
                          <div className="flex items-center space-x-1">
                          </div>
                          {recipe.publishDate && (
                            <span>Published {new Date(recipe.publishDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedRecipe(recipe.fullData);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition"
                          title="Preview recipe"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(recipe)}
                          className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition"
                          title="Delete recipe"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && filteredRecipes.length > pageSize && <Pagination />}

      <RecipeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={selectedRecipe}
      />

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Confirmación</h2>
            <p className="text-text-secondary mb-4">¿Estás seguro que deseas eliminar la receta "{recipeToDelete?.title}"?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded bg-secondary-100 text-text-secondary hover:bg-secondary-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteRecipe}
                className="px-4 py-2 rounded bg-error text-white hover:bg-error-dark"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsManagement;
