import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const categoryColors = {
  food: 'bg-amber-50 text-amber-700',
  sleep: 'bg-blue-50 text-blue-700',
  training: 'bg-emerald-50 text-emerald-700',
  hydration: 'bg-purple-50 text-purple-700'
};

// 🔥 Normaliza la URL para imágenes del mini backend 4029
const resolveImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1557683316-973673baf926?w=800";
  }

  // Ya viene como URL externa → déjala pasar
  if (image.startsWith("http")) return image;

  // Viene como "/uploads/archivo.jpg"
  return `http://localhost:4029${image}`;
};

export default function PostCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 border border-gray-100"
    >
      <img 
        src={resolveImageUrl(post.image)}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-5">
        <span
          className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-3 capitalize ${
            categoryColors[post.category?.toLowerCase()] ||
            'bg-gray-50 text-gray-700'
          }`}
        >
          {post.category}
        </span>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              {post.avatar}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {post.author}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span className="text-sm">{post.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
