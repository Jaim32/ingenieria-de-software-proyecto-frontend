import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg border text-white flex items-center gap-3 z-[9999] transition-all
            ${toast.type === "success" ? "bg-green-600 border-green-700" : "bg-red-600 border-red-700"}
          `}
        >
          <span className="text-xl"> 
            {toast.type === "success" ? "✔️" : "❌"}
          </span>
          <span className="font-medium text-base">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
