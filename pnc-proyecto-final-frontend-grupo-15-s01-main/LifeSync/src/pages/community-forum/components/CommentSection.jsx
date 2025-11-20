import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function CommentSection({ comments, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="border-t-2 border-gray-200 pt-6 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-5">
        Comments ({comments.length})
      </h3>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <button
          onClick={handleSubmit}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Send size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {comment.avatar}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {comment.author}
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {comment.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {comment.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}