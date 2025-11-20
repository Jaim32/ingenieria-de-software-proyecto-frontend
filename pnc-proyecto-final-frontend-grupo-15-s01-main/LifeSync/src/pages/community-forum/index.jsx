import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ForumHeader from "./components/ForumHeader";
import ForumFilterBar from "./components/ForumFilterBar";
import PostsGrid from "./components/PostGrid";
import NewPostModal from "./components/NewPostModal";
import PostDetailModal from "./components/PostDetailModal";

export default function CommunityForum() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Best Pre-Workout Meals for Energy",
      description:
        "Post your favorite meals that balance calories and performance.",
      category: "Food",
      author: "Ana García",
      avatar: "AG",
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
      likes: 24,
      comments: [],
    },
    {
      id: 2,
      title: "Sleep Hacks for Busy Schedules",
      description:
        "How do you use the app to optimize sleep when you have limited hours?",
      category: "Sleep",
      author: "Carlos Ruiz",
      avatar: "CR",
      image:
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
      likes: 42,
      comments: [],
    },
    {
      id: 3,
      title: "Morning vs. Night Training",
      description:
        "Discuss how sleep and hydration affect your workout timing.",
      category: "Training",
      author: "María López",
      avatar: "ML",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      likes: 18,
      comments: [],
    },
  ]);

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filter, setFilter] = useState("Popular");

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "Food",
    image: null,
    imagePreview: null,
  });

  const handleCreatePost = (postData) => {
    const post = {
      id: Date.now(),
      title: postData.title,
      description: postData.description,
      category: postData.category,
      author: "Usuario",
      avatar: "U",
      image:
        postData.imagePreview ||
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
      likes: 0,
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost({
      title: "",
      description: "",
      category: "Food",
      image: null,
      imagePreview: null,
    });
    setShowNewPostModal(false);
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setShowPostDetailModal(true);
  };

  const handleAddComment = (commentText) => {
    if (commentText.trim() && selectedPost) {
      const comment = {
        id: Date.now(),
        author: "Usuario",
        avatar: "U",
        text: commentText,
        timestamp: "Ahora",
      };

      setPosts(
        posts.map((post) =>
          post.id === selectedPost.id
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );

      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, comment],
      });
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        likes: selectedPost.likes + 1,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Community Forum - LifeSync</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <ForumHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ForumFilterBar
            filter={filter}
            setFilter={setFilter}
            onNewPost={() => setShowNewPostModal(true)}
          />

          <PostsGrid posts={posts} onOpenPost={handleOpenPost} />
        </div>

        {showNewPostModal && (
          <NewPostModal
            newPost={newPost}
            setNewPost={setNewPost}
            onClose={() => setShowNewPostModal(false)}
            onCreate={handleCreatePost}
          />
        )}

        {showPostDetailModal && selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setShowPostDetailModal(false)}
            onLike={handleLike}
            onAddComment={handleAddComment}
          />
        )}
      </div>
    </>
  );
}
