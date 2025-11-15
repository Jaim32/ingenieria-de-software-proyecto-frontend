import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/hidratacion",
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

// GET  /api/hidratacion/me
export const status   = ()        => api.get("/me");

// POST /api/hidratacion/me/add   { progreso: ±ml }
export const addWater = (ml)      => api.post("/me/add", { progreso: ml });

export default { status, addWater };
