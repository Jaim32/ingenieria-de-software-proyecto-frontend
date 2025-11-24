import React, { useState } from "react";
import { Trash2, Edit3, Save } from "lucide-react";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

export default function CommentSection({ comments, onAddComment }) {
  const [text, setText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [confirmData, setConfirmData] = useState({
    open: false,
    onConfirm: null,
    title: "",
    message: ""
  });

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  /* ===========================================================
      CREAR COMENTARIO
  =========================================================== */
  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text);
    setText("");
  };

  /* ===========================================================
      ABRIR MODAL DE CONFIRMACIÓN
  =========================================================== */
  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  /* ===========================================================
      ELIMINAR COMENTARIO
  =========================================================== */
  const handleDelete = (commentId) => {
    openConfirm(
      "Eliminar comentario",
      "¿Seguro que deseas eliminar este comentario? Esta acción no se puede deshacer.",
      async () => {
        try {
          await axios.delete(`http://localhost:8082/api/comentarios/${commentId}`, {
            headers: { Authorization: `Bearer ${token}`, userId: currentUserId },
          });

          window.location.reload();
        } catch (err) {
          alert("No puedes eliminar este comentario.");
        }
      }
    );
  };

  /* ===========================================================
      EDITAR COMENTARIO — CONFIRMACIÓN
  =========================================================== */
  const handleEditSave = (commentId) => {
    openConfirm(
      "Guardar cambios",
      "¿Deseas guardar las modificaciones en tu comentario?",
      async () => {
        try {
          await axios.put(
            `http://localhost:8082/api/comentarios/${commentId}`,
            { contenido: editText },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                userId: currentUserId,
              },
            }
          );

          window.location.reload();
        } catch (err) {
          alert("No puedes editar este comentario.");
        }
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* =======================================================
          CONFIRM MODAL
      ======================================================= */}
      <ConfirmDialog
        open={confirmData.open}
        title={confirmData.title}
        message={confirmData.message}
        onCancel={() => setConfirmData({ ...confirmData, open: false })}
        onConfirm={() => {
          confirmData.onConfirm();
          setConfirmData({ ...confirmData, open: false });
        }}
      />

      <h3 className="text-lg font-semibold text-gray-900">
        Comments ({comments.length})
      </h3>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">

            {/* INFO DEL USUARIO */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
                {c.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold">{c.author}</p>
                <p className="text-xs text-gray-500">{c.timestamp}</p>
              </div>
            </div>

            {/* TEXTO o EDICIÓN */}
            {editingId === c.id ? (
              <div className="space-y-2">
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow hover:shadow-lg transition"
                  onClick={() => handleEditSave(c.id)}
                >
                  <Save size={14} /> Guardar
                </button>
              </div>
            ) : (
              <p className="text-gray-700 text-sm">{c.text}</p>
            )}

            {/* BOTONES SOLO SI ES SU COMENTARIO */}
            {c.userId === currentUserId && editingId !== c.id && (
              <div className="flex gap-4 mt-3">
                <button
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                  onClick={() => {
                    setEditingId(c.id);
                    setEditText(c.text);
                  }}
                >
                  <Edit3 size={14} /> Editar
                </button>

                <button
                  className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* INPUT NUEVO COMENTARIO */}
      <div className="flex gap-3 pt-3">
        <input
          type="text"
          value={text}
          placeholder="Write a comment..."
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium"
        >
          Post
        </button>
      </div>
    </div>
  );
}
