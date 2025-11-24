import React from "react";
import { Plus } from "lucide-react";

export default function ForumFilterBar({ filterType, setFilterType, search, setSearch, onNewPost }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Filtro por tipo */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-4 py-2 border rounded-lg bg-white shadow-sm"
      >
        <option value="all">All Types</option>
        <option value="Food">Food</option>
        <option value="Sleep">Sleep</option>
        <option value="Training">Training</option>
        <option value="Hydration">Hydration</option>
      </select>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-64 shadow-sm"
      />

      {/* Botón nuevo post */}
      <button
        onClick={onNewPost}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
      >
        <Plus size={18} />
        New Post
      </button>
    </div>
  );
}
