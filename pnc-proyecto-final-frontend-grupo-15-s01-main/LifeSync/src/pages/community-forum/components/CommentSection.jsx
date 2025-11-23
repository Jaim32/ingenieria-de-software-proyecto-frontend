import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function CommentSection({ comments, onAddComment }) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Comentarios</h3>
      <div className="space-y-3 mb-4">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              {c.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold">{c.author}</p>
              <p className="text-gray-700">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
