import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "../AppIcon";
import axios from "axios";

export default function ProfileSlide({ isOpen, onClose }) {
  const slideRef = useRef(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    avatar: "/assets/images/no_image.png",
    lifePoints: 1250,
    level: 3,
    rol: "USER",
    id: null,
    recipes: [],
  });

  // Estados para actualizar peso
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData((prev) => ({
            ...prev,
            name: parsedUser.nombre || "Usuario",
            avatar: parsedUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
            rol: parsedUser.rol || "USER",
            id: parsedUser.idUsuario || null,
          }));
        } catch (e) {
          console.error("Error al leer el usuario desde localStorage", e);
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!userData.id) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8082/api/recetas/usuario/${userData.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const adapted = response.data.map((r) => ({
          id: r.idReceta,
          name: r.nombre,
          date: new Date(r.fecha).toLocaleDateString(),
        }));
        setUserData((prev) => ({ ...prev, recipes: adapted }));
      } catch (error) {
        console.error("Error fetching user recipes", error);
      }
    };
    fetchUserRecipes();
  }, [userData.id]);

  if (!isOpen) return null;

  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserData({
      name: "",
      avatar: "/assets/images/no_image.png",
      lifePoints: 1250,
      level: 3,
      rol: "USER",
      id: null,
      recipes: [],
    });
    onClose();
    window.location.href = "http://localhost:4028/";
  };

  // Manejador de boton "Actualizar peso"
  const handleActualizarPeso = async () => {
    if (!showWeightInput) {
      setShowWeightInput(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8082/api/usuarios/${userData.id}/peso`,
        null,
        {
          params: { nuevoPeso: parseFloat(newWeight) },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowWeightInput(false);
      setNewWeight("");
    } catch (error) {
      console.error("Error actualizando peso", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[998]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside
        ref={slideRef}
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-[999] transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-smooth"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ height: "calc(100% - 72px)" }}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary mb-4 flex items-center justify-center bg-gray-100">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Icon name="User" size={48} className="text-text-secondary" />
              )}
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {userData.name || "Usuario"}
            </h3>
            {userData.rol && userData.rol !== "USER" && (
              <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-2">
                {userData.rol}
              </span>
            )}
          </div>

          {/* Botón e input para actualizar peso */}
          <div className="mb-6 px-4">
            <button
              onClick={handleActualizarPeso}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-smooth mb-2"
            >
              Actualizar peso
            </button>
            {showWeightInput && (
              <input
                type="number"
                placeholder="Nuevo peso (kg)"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none"
              />
            )}
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-text-primary mb-4">My Recipes</h4>
            {userData.recipes.length === 0 ? (
              <p className="text-sm text-text-secondary">No recipes yet</p>
            ) : (
              <ul className="space-y-3">
                {userData.recipes.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/community-recipe-browse?recipe=${r.id}`}
                      onClick={onClose}
                      className="block p-3 bg-gray-50 rounded-lg border border-border hover:border-primary transition-smooth"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-text-primary">{r.name}</h5>
                        </div>
                        <span className="text-primary hover:text-secondary transition-smooth">
                          <Icon name="ExternalLink" size={16} />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-5 mb-8 text-white">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="Utensils" size={18} />
              <span>RecipeHub</span>
            </h4>
            <p className="text-sm mb-3">
              Share and discover healthy recipes from our community.
            </p>
            <button
              onClick={() => {
                onClose();
                navigate("/community-recipe-browse");
              }}
              className="bg-white text-primary text-sm font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-smooth"
            >
              Explore RecipeHub
            </button>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-smooth"
          >
            <Icon name="LogOut" size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
