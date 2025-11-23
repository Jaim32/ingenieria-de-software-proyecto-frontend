import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import CommentSection from './CommentSection';

const categoryColors = {
  food: 'bg-amber-50 text-amber-700',
  sleep: 'bg-blue-50 text-blue-700',
  training: 'bg-emerald-50 text-emerald-700',
  hydration: 'bg-purple-50 text-purple-700',
};

export default function PostDetailModal({ post, onClose, onLike, onAddComment }) {
  const [comments, setComments] = useState(post.comments || []);

  const handleAddComment = async (commentText) => {
    if (!commentText.trim()) return;

    try {
      const newComment = await onAddComment(commentText, post.idPost);
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.error('Error agregando comentario:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Post Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded-xl mb-5"
          />

          <span
            className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-3 capitalize ${
              categoryColors[post.category.toLowerCase()] || 'bg-gray-50 text-gray-700'
            }`}
          >
            {post.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h1>

          <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {post.avatar}
              </div>
              <span className="text-sm font-semibold text-gray-900">{post.author}</span>
            </div>

            <button
              onClick={() => onLike(post.idPost)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Heart size={18} />
              <span className="font-medium">{post.likes}</span>
            </button>
          </div>

          <p className="text-base text-gray-700 leading-relaxed mb-6">{post.description}</p>

          <CommentSection comments={comments} onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
