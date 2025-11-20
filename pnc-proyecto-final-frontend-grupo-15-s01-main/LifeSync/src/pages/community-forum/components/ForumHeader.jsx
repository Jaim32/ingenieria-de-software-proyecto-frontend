import React from 'react';

export default function ForumHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Explore what's happening
        </h1>
        <p className="text-gray-600 text-center">
          Community: Connect with others, share ideas, and join discussions.
        </p>
      </div>
    </header>
  );
}