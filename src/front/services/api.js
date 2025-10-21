// src/front/services/api.js

// ✅ URL del backend (viene desde tu .env)
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// ✅ Helper para crear headers con o sin token
const headers = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ✅ Objeto principal con todos los métodos de tu API
export const api = {
  // 🔹 LOGIN
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Error en login");
    return await res.json();
  },

  // 🔹 REGISTER
  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Error en registro");
    return await res.json();
  },

  // 🔹 OBTENER USUARIO ACTUAL (token JWT)
  me: async (token) => {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: headers(token),
    });
    if (!res.ok) throw new Error("Error obteniendo usuario");
    return await res.json();
  },

  // 🔹 OBTENER TODAS LAS PELÍCULAS (público)
  getMovies: async () => {
    const res = await fetch(`${API_URL}/api/movies`);
    if (!res.ok) throw new Error("Error obteniendo películas");
    return await res.json();
  },

  // 🔹 OBTENER DETALLE DE UNA PELÍCULA
  getMovieById: async (id) => {
    const res = await fetch(`${API_URL}/api/movies/${id}`);
    if (!res.ok) throw new Error("Error obteniendo detalle de película");
    return await res.json();
  },

  // 🔹 AGREGAR FAVORITO
  addFavorite: async (movieId, token) => {
    const res = await fetch(`${API_URL}/api/favorites`, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify({ movie_id: movieId }),
    });
    if (!res.ok) throw new Error("Error agregando favorito");
    return await res.json();
  },

  // 🔹 ELIMINAR FAVORITO
  removeFavorite: async (movieId, token) => {
    const res = await fetch(`${API_URL}/api/favorites/${movieId}`, {
      method: "DELETE",
      headers: headers(token),
    });
    if (!res.ok) throw new Error("Error eliminando favorito");
    return await res.json();
  },
};
