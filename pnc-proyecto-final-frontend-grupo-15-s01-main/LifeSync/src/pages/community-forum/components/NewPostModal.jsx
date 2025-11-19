import React from 'react';
import { X, Image } from 'lucide-react';

export default function NewPostModal({ newPost, setNewPost, onClose, onCreate }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({
          ...newPost,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (newPost.title && newPost.description) {
      onCreate(newPost);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-indigo-500 focus:outline-none transition-colors"
          />

          <textarea
            placeholder="Post Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            rows="5"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base resize-none focus:border-indigo-500 focus:outline-none transition-colors"
          />

          <select
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base bg-white cursor-pointer focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="Food">Food</option>
            <option value="Sleep">Sleep</option>
            <option value="Training">Training</option>
            <option value="Hydration">Hydration</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />

          {newPost.imagePreview ? (
            <div className="space-y-3">
              <img
                src={newPost.imagePreview}
                alt="Preview"
                className="w-full max-h-72 object-cover rounded-xl"
              />
              <button
                onClick={() => setNewPost({ ...newPost, image: null, imagePreview: null })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-all"
            >
              <Image size={48} className="text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">Click to upload image</p>
            </label>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
}