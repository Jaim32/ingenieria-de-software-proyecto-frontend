import React from 'react';
import PostCard from './PostCard';

export default function PostsGrid({ posts, onOpenPost }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => onOpenPost(post)}
        />
      ))}
    </div>
  );
}