import React from "react";

export default function ConfirmDialog({ open, onCancel, onConfirm, title, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl animate-fadeIn">
        
        {/* Título */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        
        {/* Mensaje */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:shadow-lg hover:scale-105 transition"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
