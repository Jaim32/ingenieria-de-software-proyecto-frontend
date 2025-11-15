import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import ContextualModal from 'components/ui/ContextualModal';

const RecipePreviewModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('id');

  const [recipeData, setRecipeData] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [viewportMode, setViewportMode] = useState('desktop');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteReasons = [
    'Violates community guidelines',
    'Inappropriate content',
    'Copyright infringement',
    'Misleading information',
    'Spam or promotional content',
    'Other policy violation'
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:8082/recetas/${recipeId}`);
        if (!res.ok) throw new Error('Error fetching recipe');
        const data = await res.json();
        setRecipeData(data);
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
        navigate('/administrative-dashboard');
      }
    };

    if (recipeId) fetchRecipe();
  }, [recipeId, navigate]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate('/administrative-dashboard');
    }, 300);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Aquí iría el fetch real a DELETE
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Audit Log:', {
      action: 'recipe_deleted',
      recipeId: recipeData.id,
      reason: deleteReason,
      timestamp: new Date().toISOString(),
      adminUser: 'current_admin_user'
    });

    setIsDeleting(false);
    setShowDeleteConfirmation(false);
    handleClose();
  };

  const getViewportClasses = () => {
    switch (viewportMode) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'max-w-4xl mx-auto';
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: 'status-badge status-success',
      pending: 'status-badge status-warning',
      draft: 'status-badge bg-secondary-100 text-secondary-700'
    };
    return statusClasses[status] || 'status-badge';
  };

  if (!recipeData) {
    return (
      <div className="theme-admin fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Icon name="Loader2" className="animate-spin text-orange-500 mx-auto mb-4" size={36} />
          <p className="text-gray-700">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ...aquí va todo el mismo layout de antes... */}
      {/* Sustituye todo lo relacionado con `recipeData` según ya está estructurado en tu versión actual, usando los datos obtenidos del backend */}

      {/* Modal de confirmación de eliminación */}
      <ContextualModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Delete Recipe"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="#DC2626" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary">Confirm Recipe Deletion</h3>
              <p className="text-text-secondary">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-secondary-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Image
                src={recipeData.image}
                alt={recipeData.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium text-text-primary">{recipeData.title}</h4>
                <p className="text-sm text-text-secondary">by {recipeData.creator}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Reason for deletion *
            </label>
            <select
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a reason...</option>
              {deleteReasons.map((reason, index) => (
                <option key={index} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={isDeleting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!deleteReason || isDeleting}
              className="bg-error text-white px-4 py-2 rounded-lg font-medium transition-all duration-150 hover:bg-error-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting && <Icon name="Loader2" size={16} className="animate-spin" />}
              <span>{isDeleting ? 'Deleting...' : 'Delete Recipe'}</span>
            </button>
          </div>
        </div>
      </ContextualModal>
    </>
  );
};

export default RecipePreviewModal;
