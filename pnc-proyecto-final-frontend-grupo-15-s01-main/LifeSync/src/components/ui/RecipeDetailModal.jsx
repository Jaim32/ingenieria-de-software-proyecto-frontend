import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Image from "../AppImage";

/* ===========================================================
   CONFIRMACIÓN UNIVERSAL
=========================================================== */
function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border shadow-xl space-y-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-gray-700">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-xl"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   MODAL PRINCIPAL
=========================================================== */
export default function RecipeDetailModal({ isOpen, onClose, recipe }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Siempre en el mismo orden
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [confirmData, setConfirmData] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  /* ===========================================================
     CARGAR COMENTARIOS
  =========================================================== */
  useEffect(() => {
    if (!isOpen || !recipe?.idReceta) return;

    const loadComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:8082/api/recetas/${recipe.idReceta}/comentarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) return;
        const data = await res.json();

        setComments(data || []);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };

    loadComments();
  }, [isOpen, recipe?.idReceta]);

  /* ===========================================================
     SINCRONIZAR URL
  =========================================================== */
  useEffect(() => {
    if (!recipe) return;

    const params = new URLSearchParams(location.search);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      params.set("recipe", recipe.idReceta);
    } else {
      document.body.style.overflow = "unset";
      params.delete("recipe");
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, recipe, navigate, location.pathname]);

  /* ===========================================================
     GUARDAR NUEVO COMENTARIO
  =========================================================== */
  const handleSaveComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8082/api/recetas/${recipe.idReceta}/comentarios`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenido: commentText }),
        }
      );

      if (!res.ok) return;

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);

      setIsCommentPopupOpen(false);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ===========================================================
     ELIMINAR COMENTARIO
  =========================================================== */
  const handleDelete = (id) => {
    setConfirmData({
      open: true,
      title: "Delete comment",
      message: "Are you sure you want to delete this comment?",
      onConfirm: async () => {
        try {
          await fetch(`http://localhost:8082/api/comentarios/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              userId: currentUserId,
            },
          });

          setComments((prev) =>
            prev.filter((c) => c.idComentario !== id)
          );
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  /* ===========================================================
     GUARDAR EDICIÓN
  =========================================================== */
  const handleEditSave = (id) => {
    setConfirmData({
      open: true,
      title: "Save changes",
      message: "Do you want to update this comment?",
      onConfirm: async () => {
        try {
          await fetch(`http://localhost:8082/api/comentarios/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              userId: currentUserId,
            },
            body: JSON.stringify({ contenido: editText }),
          });

          setComments((prev) =>
            prev.map((c) =>
              c.idComentario === id ? { ...c, contenido: editText } : c
            )
          );

          setEditingId(null);
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  /* ===========================================================
     NO MOSTRAR UI SI NO ESTÁ ABIERTO
  =========================================================== */
  if (!isOpen || !recipe) return null;

  /* ===========================================================
     UI
  =========================================================== */
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col border">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-heading text-lg">
            {recipe.nombre ?? "Untitled"}
          </h2>

          <button onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          {recipe.imagen && (
            <Image
              src={recipe.imagen}
              alt={recipe.nombre}
              className="w-full h-64 object-cover rounded-xl"
            />
          )}

          <section className="bg-surface p-4 rounded-xl border">
            <h3 className="font-heading text-lg mb-2">Description</h3>
            <p className="text-gray-700">
              {recipe.descripcion || "No description available"}
            </p>
          </section>

          {/* COMENTARIOS */}
          <section className="bg-surface p-4 rounded-xl border space-y-4">
            <h3 className="font-heading text-lg">
              Comments ({comments.length})
            </h3>

            <ul className="space-y-3">
              {comments.map((c) => (
                <li
                  key={c.idComentario}
                  className="border p-4 rounded-xl bg-background"
                >
                  <div className="font-semibold">{c.nombreUsuario}</div>

                  {editingId === c.idComentario ? (
                    <>
                      <textarea
                        className="w-full border rounded-xl p-2 mt-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        onClick={() => handleEditSave(c.idComentario)}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-700 mt-1">{c.contenido}</p>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>

                  {c.idUser === currentUserId &&
                    editingId !== c.idComentario && (
                      <div className="flex gap-4 mt-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setEditingId(c.idComentario);
                            setEditText(c.contenido);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(c.idComentario)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </li>
              ))}
            </ul>

            <button
              className="bg-primary text-white px-4 py-2 rounded-xl"
              onClick={() => setIsCommentPopupOpen(true)}
            >
              Add comment
            </button>
          </section>
        </div>

        {/* POPUP NUEVO COMENTARIO */}
        {isCommentPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md border space-y-4">

              <h3 className="font-semibold text-lg">New Comment</h3>

              <textarea
                rows={4}
                className="w-full border rounded-xl p-2"
                placeholder="Write something..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                  onClick={() => setIsCommentPopupOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-primary text-white rounded-xl"
                  onClick={handleSaveComment}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM DIALOG */}
        <ConfirmDialog
          open={confirmData.open}
          title={confirmData.title}
          message={confirmData.message}
          onCancel={() =>
            setConfirmData((prev) => ({ ...prev, open: false }))
          }
          onConfirm={() => {
            confirmData.onConfirm();
            setConfirmData((prev) => ({ ...prev, open: false }));
          }}
        />
      </div>
    </div>
  );
}
