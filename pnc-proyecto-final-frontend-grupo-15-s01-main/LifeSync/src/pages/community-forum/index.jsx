import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import ForumHeader from "./components/ForumHeader";
import ForumFilterBar from "./components/ForumFilterBar";
import PostsGrid from "./components/PostGrid";
import NewPostModal from "./components/NewPostModal";
import PostDetailModal from "./components/PostDetailModal";

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const token = localStorage.getItem("token");

  /* ===========================================================
     Cargar posts + comentarios
  ============================================================== */
  const fetchPosts = async () => {
    if (!token) return console.error("Token missing");

    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8082/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let postsData = Array.isArray(res.data) ? res.data : [];

      // Obtener comentarios por post
      const postsWithComments = await Promise.all(
        postsData.map(async (p) => {
          try {
            const commentsRes = await axios.get(
              `http://localhost:8082/api/posts/${p.idPost}/comentarios`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Normalizar comentarios e incluir nombreUsuario
            let comments = commentsRes.data.map((c) => ({
              id: c.idComentario,
              text: c.contenido,
              timestamp: c.fecha || "",
              userId: c.idUser,
              author: c.nombreUsuario || "Usuario",
              avatar: c.nombreUsuario
                ? c.nombreUsuario[0].toUpperCase()
                : "U",
              _raw: c,
            }));

            return { ...p, comments };
          } catch {
            return { ...p, comments: [] };
          }
        })
      );

      // Normalizar posts
      const normalized = postsWithComments.map((p) => ({
        idPost: p.idPost,
        title: p.title,
        description: p.content || p.description,
        category: p.type || "General",
        image: p.image || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
        likes: p.likes ?? 0,
        comments: p.comments,
        userId: p.userId,
        author: p.nombreUsuario || "Desconocido",
        avatar: p.nombreUsuario
          ? p.nombreUsuario[0].toUpperCase()
          : "U",
        _raw: p,
      }));

      setPosts(normalized);
    } catch (err) {
      console.error("Error cargando posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ===========================================================
     Crear nuevo post
  ============================================================== */
  const handleCreatePost = async (postData) => {
    if (!token) return;

    try {
      const userId = localStorage.getItem("userId");

      await axios.post(
        "http://localhost:8082/api/posts",
        {
          title: postData.title,
          content: postData.description,
          type: "general",
          userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPosts();
      setShowNewPostModal(false);
      setNewPost({ title: "", description: "", category: "Food", image: null, imagePreview: null });
    } catch (err) {
      console.error("Error creando post:", err);
    }
  };

  /* ===========================================================
     Agregar comentario
  ============================================================== */
  const handleAddComment = async (commentText, postId) => {
    if (!token || !commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8082/api/posts/${postId}/comentarios`,
        { contenido: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const c = res.data;

      let newComment = {
        id: c.idComentario,
        text: c.contenido,
        timestamp: c.fecha || "Just now",
        userId: c.idUser,
        author: c.nombreUsuario,
        avatar: c.nombreUsuario
          ? c.nombreUsuario[0].toUpperCase()
          : "U",
        _raw: c,
      };

      // Actualizar posts
      setPosts((prev) =>
        prev.map((p) =>
          p.idPost === postId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );

      // Actualizar modal abierto
      if (selectedPost?.idPost === postId) {
        setSelectedPost((prev) => ({
          ...prev,
          comments: [...prev.comments, newComment],
        }));
      }

      return newComment;
    } catch (err) {
      console.error("Error agregando comentario:", err.response?.data || err);
    }
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setShowPostDetailModal(true);
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.idPost === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );

    if (selectedPost?.idPost === postId) {
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

          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : (
            <PostsGrid posts={posts} onOpenPost={handleOpenPost} />
          )}
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
};

export default CommunityForum;
