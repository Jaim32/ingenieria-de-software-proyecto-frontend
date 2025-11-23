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
     Función para enriquecer comentarios con usuario
  ============================================================== */
 const enrichCommentsWithUsers = async (comments) => {
  const token = localStorage.getItem("token");

  const userIds = [...new Set(comments.map(c => c.idUser).filter(Boolean))];
  const userMap = {};

 await Promise.all(userIds.map(async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8082/api/usuarios/getById?idUsuario=${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Usuario API response:', res.data); // <--- aquí
    const user = res.data?.data || res.data || {};
    userMap[id] = {
      nombre: user.nombre || "Usuario",
      avatar: user.avatar || (user.nombre ? user.nombre[0].toUpperCase() : "U"),
    };
  } catch {
    userMap[id] = { nombre: "Usuario", avatar: "U" };
  }
}));



  const enriched = comments.map(c => ({
    ...c,
    author: userMap[c.idUser]?.nombre || "Usuario",
    avatar: userMap[c.idUser]?.avatar || "U",
  }));

  console.log("Enriched comments:", enriched); // ✅ Aquí puedes ver los nombres
  return enriched;
};




  /* ===========================================================
     Función para enriquecer posts con usuario y comentarios
  ============================================================== */
  const enrichPostsWithAuthor = async (posts) => {
    const normalized = posts.map((p) => ({
      idPost: p.idPost || p.id,
      title: p.title || "",
      description: p.content || p.description || "",
      category: p.category || p.type || "General",
      image: p.image || p.imageUrl || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
      likes: typeof p.likes === "number" ? p.likes : 0,
      comments: Array.isArray(p.comments) ? p.comments : [],
      userId: p.userId,
      author: "Desconocido",
      avatar: "U",
      _raw: p,
    }));

    const userIds = [...new Set(normalized.map((p) => p.userId).filter(Boolean))];
    const userMap = {};

    await Promise.all(
      userIds.map(async (id) => {
        try {
          const res = await axios.get(`http://localhost:8082/api/usuarios/getById?idUsuario=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const u = res.data?.data || res.data || {};
          userMap[id] = { nombre: u.nombre || "Desconocido", avatar: u.avatar || "U" };
        } catch {
          userMap[id] = { nombre: "Desconocido", avatar: "U" };
        }
      })
    );

    return normalized.map((p) => ({
  ...p,
  author: userMap[p.userId]?.nombre || "Desconocido",
  avatar: userMap[p.userId]?.avatar || "U", // <-- usar userId, no idUser
}));

  };
  

  /* ===========================================================
     Fetch posts desde backend
  ============================================================== */
  const fetchPosts = async () => {
    if (!token) return console.error("Token missing");
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8082/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let postsData = Array.isArray(res.data) ? res.data : [];

      // Traer comentarios para cada post
      const postsWithComments = await Promise.all(
        postsData.map(async (p) => {
          try {
            const commentsRes = await axios.get(
              `http://localhost:8082/api/posts/${p.idPost}/comentarios`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            let comments = commentsRes.data.map((c) => ({
              id: c.idComentario || c.id,
              text: c.contenido,
              timestamp: c.fecha || "",
              userId: c.idUser,
              _raw: c,
            }));

            comments = await enrichCommentsWithUsers(comments);

            return { ...p, comments };
          } catch {
            return { ...p, comments: [] };
          }
        })
      );

      const adapted = await enrichPostsWithAuthor(postsWithComments);
      setPosts(adapted);
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

    // Normalizar comentario
    let newComment = {
      id: c.idComentario,
      text: c.contenido,
      timestamp: c.fecha || "Just now",
      userId: c.idUser,
      _raw: c
    };

    // Enriquecer con autor y avatar
    [newComment] = await enrichCommentsWithUsers([newComment]);

    // Actualizar posts
    setPosts((prev) =>
      prev.map((p) =>
        p.idPost === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );

    // Actualizar post seleccionado
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
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
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
