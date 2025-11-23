import React from "react";

export default function Toast({ message, type }) {
  return (
    <div
      className={`
        fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3
        text-white text-sm font-medium animate-fade-in-up
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      <span>{message}</span>
    </div>
  );
}
