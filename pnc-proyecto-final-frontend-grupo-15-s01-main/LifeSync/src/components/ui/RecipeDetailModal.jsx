import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

function RecipeDetailModal({ isOpen, onClose, recipe }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [comments, setComments] = useState(() => recipe?.comentarios || []);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setComments(recipe?.comentarios || []);
  }, [recipe]);

  // URL handling
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
      navigate(
        `${location.pathname}${newSearch ? `?${newSearch}` : ''}`,
        { replace: true }
      );
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, recipe?.idReceta, location.pathname, navigate]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !recipe) return null;

  // Comment popup logic
  const openCommentPopup = () => {
    setIsCommentPopupOpen(true);
    setCommentText('');
  };

  const closeCommentPopup = () => {
    setIsCommentPopupOpen(false);
    setCommentText('');
  };

  const handleSaveComment = () => {
    const text = commentText.trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      text,
    };

    setComments((prev) => [...prev, newComment]);
    closeCommentPopup();
  };

  return (
    <div
      className="fixed inset-0 z-modal-backdrop bg-black bg-opacity-50 flex items-center justify-center px-4 py-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-border-color">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-background">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="Utensils" size={18} className="text-white" />
            </div>
            <h2 className="font-heading font-heading-bold text-base md:text-lg text-text-primary truncate">
              {recipe.nombre || 'Recipe Details'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary hover:bg-surface hover:text-text-primary transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto relative">

          {/* Image */}
          {recipe.imagen && (
            <Image
              src={recipe.imagen}
              alt={recipe.nombre}
              className="w-full h-56 md:h-72 object-cover"
            />
          )}

          <div className="px-6 pb-6 pt-4 space-y-6">

            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-heading font-heading-bold text-2xl md:text-3xl text-text-primary">
                {recipe.nombre}
              </h1>

              {recipe.tipoDeComida && (
                <span className="inline-flex items-center rounded-full bg-primary text-white text-xs font-medium px-3 py-1">
                  {recipe.tipoDeComida}
                </span>
              )}
            </div>

            {/* Description */}
            <section className="bg-surface border border-border-color rounded-xl px-5 py-4">
              <h3 className="font-heading text-lg text-text-primary mb-2">
                Description
              </h3>
              <p className="text-sm md:text-base text-text-secondary">
                {recipe.descripcion || 'N/A'}
              </p>
            </section>

            {/* Ingredient Details */}
            <section className="bg-surface border border-border-color rounded-xl px-5 py-4">
              <h3 className="font-heading text-lg text-text-primary mb-4">
                Ingredient Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Proteins */}
                <div className="space-y-1.5">
                  <h4 className="font-heading text-sm font-semibold text-text-primary">Proteins</h4>
                  <p className="text-sm"><strong>Type:</strong> {recipe.proteina}</p>
                  <p className="text-sm"><strong>Cut:</strong> {recipe.corteProteina}</p>
                  <p className="text-sm"><strong>Portion:</strong> {recipe.porcionProteina}</p>
                  <p className="text-sm"><strong>Cooking Method:</strong> {recipe.coccionProteina}</p>
                </div>

                {/* Vegetables */}
                <div className="space-y-1.5">
                  <h4 className="font-heading text-sm font-semibold text-text-primary">Vegetables</h4>
                  <p className="text-sm"><strong>Type:</strong> {recipe.vegetales}</p>
                  <p className="text-sm"><strong>Portion:</strong> {recipe.porcionVegetales}</p>
                  <p className="text-sm"><strong>Cooking Method:</strong> {recipe.coccionVegetales}</p>
                </div>

                {/* Carbohydrates */}
                <div className="space-y-1.5">
                  <h4 className="font-heading text-sm font-semibold text-text-primary">Carbohydrates</h4>
                  <p className="text-sm"><strong>Type:</strong> {recipe.carbohidratos}</p>
                  <p className="text-sm"><strong>Portion:</strong> {recipe.porcionCarbohidratos}</p>
                  <p className="text-sm"><strong>Cooking Method:</strong> {recipe.coccionCarbohidratos}</p>
                </div>

                {/* Meal Type */}
                <div className="space-y-1.5">
                  <h4 className="font-heading text-sm font-semibold text-text-primary">Meal Type</h4>
                  <p className="text-sm">{recipe.tipoDeComida || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Ingredients List */}
            <section className="bg-surface border border-border-color rounded-xl px-5 py-4">
              <h3 className="font-heading text-lg text-text-primary mb-2">
                Complete Ingredients List
              </h3>
              <p className="text-sm md:text-base text-text-secondary whitespace-pre-wrap">
                {recipe.ingredientesLista || 'N/A'}
              </p>
            </section>

            {/* Procedure */}
            <section className="bg-surface border border-border-color rounded-xl px-5 py-4">
              <h3 className="font-heading text-lg text-text-primary mb-2">
                Procedure
              </h3>
              <p className="text-sm md:text-base text-text-secondary whitespace-pre-wrap">
                {recipe.procedimiento || 'N/A'}
              </p>
            </section>

            {/* Comments */}
            <section className="bg-surface border border-border-color rounded-xl px-5 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="MessageCircle" size={18} />
                <h3 className="font-heading text-lg text-text-primary">
                  Comments ({comments.length})
                </h3>
              </div>

              {comments.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-border-color bg-background px-4 py-3 text-sm text-text-primary"
                    >
                      {c.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Comment button */}
            <div className="flex justify-end pt-1">
              <button
                className="
                  inline-flex 
                  items-center 
                  justify-center 
                  gap-2 
                  px-6 
                  py-3 
                  rounded-xl 
                  bg-primary 
                  text-white 
                  text-sm 
                  font-medium 
                  shadow 
                  hover:bg-primary/90
                "
                onClick={openCommentPopup}
              >
                <Icon name="MessageCircle" size={18} />
                <span>Comment</span>
              </button>
            </div>
          </div>

          {/* Popup para escribir comentario */}
          {isCommentPopupOpen && (
            <div
              className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center px-4"
              onClick={(e) => {
                e.stopPropagation();
                closeCommentPopup();
              }}
            >
              <div
                className="bg-background w-full max-w-md rounded-2xl shadow-xl border border-border-color p-5 space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="MessageCircle" size={18} />
                    <h3 className="text-base font-heading font-heading-bold text-text-primary">
                      Add comment
                    </h3>
                  </div>

                  <button
                    className="p-1.5 rounded-full hover:bg-surface text-text-secondary"
                    onClick={closeCommentPopup}
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>

                <textarea
                  rows={4}
                  className="
                    w-full 
                    rounded-xl 
                    border 
                    border-border-color 
                    bg-background 
                    px-3 
                    py-2 
                    text-sm 
                    text-text-primary 
                    placeholder:text-text-secondary
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-primary
                  "
                  placeholder="Write your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface"
                    onClick={closeCommentPopup}
                  >
                    Cancel
                  </button>

                  <button
                    className="
                      px-5 
                      py-2 
                      rounded-xl 
                      text-sm 
                      font-medium 
                      bg-primary 
                      text-white 
                      hover:bg-primary/90 
                      disabled:opacity-60
                    "
                    onClick={handleSaveComment}
                    disabled={!commentText.trim()}
                  >
                    Post comment
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;