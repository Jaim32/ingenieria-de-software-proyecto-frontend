import React, { useState } from "react";
import axios from "axios";
import { X, Trash2 } from "lucide-react";
import CommentSection from "./CommentSection";

const categoryColors = {
  food: "bg-amber-50 text-amber-700",
  sleep: "bg-blue-50 text-blue-700",
  training: "bg-emerald-50 text-emerald-700",
  hydration: "bg-purple-50 text-purple-700",
};

// Resolver URL del backend 4029
const resolveImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1557683316-973673baf926?w=800";
  }
  if (image.startsWith("http")) return image;
  return `http://localhost:4029${image}`;
};

// Toast
function Toast({ type, message }) {
  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white z-[9999]
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      <span>{type === "success" ? "✔️" : "❌"}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}

export default function PostDetailModal({ post, onClose, onAddComment }) {
  const [comments, setComments] = useState(post.comments || []);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 2000);
  };

  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === post.userId; // 🔥 SOLO EL DUEÑO

  const handleAddComment = async (commentText) => {
    if (!commentText.trim()) return;

    try {
      const newComment = await onAddComment(commentText, post.idPost);
      setComments((prev) => [...prev, newComment]);
      showToast("success", "Comment submitted!");
    } catch (err) {
      showToast("error", "Unable to post comment");
    }
  };

  // 🔥 Eliminar post
  const deletePost = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8082/api/posts/${post.idPost}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteConfirm(false);
      showToast("success", "Post deleted!");

      setTimeout(() => {
        window.location.reload(); // Recargar foro
      }, 1200);
    } catch (err) {
      showToast("error", "Failed to delete post");
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

          <div className="flex items-center gap-3">
            {/* 🔥 Solo dueño del post puede eliminar */}
            {isOwner && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={22} className="text-red-500" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

        </div>

        {/* Body */}
        <div className="p-6">

          <img
            src={resolveImageUrl(post.image)}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded-xl mb-5"
          />

          <span
            className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-3 capitalize ${
              categoryColors[post.category?.toLowerCase()] || "bg-gray-50 text-gray-700"
            }`}
          >
            {post.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 pb-5 mb-5 border-b border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {post.avatar}
            </div>
            <span className="text-sm font-semibold text-gray-900">{post.author}</span>
          </div>

          <p className="text-base text-gray-700 leading-relaxed mb-6">
            {post.description}
          </p>

          <CommentSection comments={comments} onAddComment={handleAddComment} />
        </div>

        {/* Toast */}
        {toast.show && <Toast type={toast.type} message={toast.message} />}

        {/* 🔥 Modal Confirmación Delete */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Post?
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={deletePost}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
