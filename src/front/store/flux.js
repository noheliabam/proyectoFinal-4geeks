// src/front/store/flux.js
import { api } from "../services/api";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    // 🧠 Estado global de la app
    store: {
      user: null,
      token: localStorage.getItem("token") || null,
      movies: [],
      selectedMovie: null,
      favorites: [],
    },

    // ⚙️ Acciones globales (para login, películas, favoritos, etc.)
    actions: {
      // 🔹 LOGIN
      login: async (email, password) => {
        try {
          const data = await api.login(email, password);
          if (data.token) {
            localStorage.setItem("token", data.token);
            setStore({ token: data.token, user: data.user });
          }
          return data;
        } catch (err) {
          console.error("❌ Error en login:", err);
        }
      },

      // 🔹 LOGOUT
      logout: () => {
        localStorage.removeItem("token");
        setStore({ token: null, user: null, favorites: [] });
      },

      // 🔹 REGISTRO
      register: async (name, email, password) => {
        try {
          const data = await api.register(name, email, password);
          if (data.token) {
            localStorage.setItem("token", data.token);
            setStore({ token: data.token, user: data.user });
          }
          return data;
        } catch (err) {
          console.error("❌ Error en registro:", err);
        }
      },

      // 🔹 CARGAR USUARIO ACTUAL
      loadUser: async () => {
        const store = getStore();
        if (!store.token) return;
        try {
          const user = await api.me(store.token);
          setStore({ user });
        } catch (err) {
          console.error("❌ Error cargando usuario:", err);
        }
      },

      // 🔹 CARGAR TODAS LAS PELÍCULAS
      loadMovies: async () => {
        try {
          const movies = await api.getMovies();
          setStore({ movies });
        } catch (err) {
          console.error("❌ Error al cargar películas:", err);
        }
      },

      // 🔹 CARGAR DETALLE DE UNA PELÍCULA
      loadMovieDetail: async (id) => {
        try {
          const movie = await api.getMovieById(id);
          setStore({ selectedMovie: movie });
        } catch (err) {
          console.error("❌ Error al cargar detalle de película:", err);
        }
      },

      // 🔹 AGREGAR A FAVORITOS
      addFavorite: async (movieId) => {
        const store = getStore();
        if (!store.token) {
          console.warn("⚠️ Usuario no autenticado: no puede agregar favoritos");
          return;
        }
        try {
          const res = await api.addFavorite(movieId, store.token);
          setStore({ favorites: [...store.favorites, res] });
        } catch (err) {
          console.error("❌ Error al agregar favorito:", err);
        }
      },

      // 🔹 ELIMINAR FAVORITO
      removeFavorite: async (movieId) => {
        const store = getStore();
        if (!store.token) return;
        try {
          await api.removeFavorite(movieId, store.token);
          const updated = store.favorites.filter(f => f.id !== movieId);
          setStore({ favorites: updated });
        } catch (err) {
          console.error("❌ Error al eliminar favorito:", err);
        }
      },
    },
  };
};

export default getState;
