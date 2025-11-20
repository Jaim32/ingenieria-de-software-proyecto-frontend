import React from 'react';
import { Plus } from 'lucide-react';

export default function ForumFilterBar({ filter, setFilter, onNewPost }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
      
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilter('Popular')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            filter === 'Popular'
              ? 'bg-orange-500 text-white border-2 border-orange-500'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          Popular
        </button>
        
        <button
          onClick={() => setFilter('Newest')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            filter === 'Newest'
              ? 'bg-orange-500 text-white border-2 border-orange-500'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          Newest
        </button>
        
        <button
          onClick={onNewPost}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>
    </div>
  );
}