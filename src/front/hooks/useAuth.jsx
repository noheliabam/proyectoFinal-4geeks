// src/front/hooks/useAuth.jsx
import { useCallback, useEffect } from "react";
import useGlobalReducer from "./useGlobalReducer";

const BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, ""); //lee la url del BE desde .env y quita las barras 

export function useAuth() {

  const { store, dispatch } = useGlobalReducer(); //reducer global para leer, escribir: user, token, loading, error
  const { user, token, loading, error } = store;

  // carga inicial desde localStorage
  //al cargar la app, si ya existe token, usuario no se pierde al refrescar
  useEffect(() => {
    const t = localStorage.getItem("mv_token");
    const u = localStorage.getItem("mv_user");
    if (t && !store.token) {
      dispatch({
        type: "auth_set",
        payload: { token: t, user: u ? JSON.parse(u) : null },
      });
    }

  }, []);


  //POST /api/auth/login con email/password
  //se espera token, user
  //guarda en store y el localStore
  //si falla pone error legible
  //devuelve true o false para que el componente sepa si navegar, mostrar mensaje, etc..
  //useCallback memoriza la funcion asi no sse recrea en cada render
  const login = useCallback(
    async (email, password) => {
      dispatch({ type: "auth_loading", payload: true });
      try {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        dispatch({
          type: "auth_set",
          payload: { token: data.token, user: data.user },
        });

        localStorage.setItem("mv_token", data.token);
        localStorage.setItem("mv_user", JSON.stringify(data.user));
        return true;
      } catch {
        dispatch({ type: "auth_error", payload: "Credenciales inválidas" });
        return false;
      } finally {
        dispatch({ type: "auth_loading", payload: false });
      }
    },
    [dispatch]
  );

  //igual que login cuando te registras te deja ya logueado y guarda token+user
  const register = useCallback(
    async ({ name, email, password }) => {
      dispatch({ type: "auth_loading", payload: true });
      try {
        const data = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        dispatch({
          type: "auth_set",
          payload: { token: data.token, user: data.user },
        });
        localStorage.setItem("mv_token", data.token);
        localStorage.setItem("mv_user", JSON.stringify(data.user));
        return true;
      } catch {
        dispatch({ type: "auth_error", payload: "Registro falló" });
        return false;
      } finally {
        dispatch({ type: "auth_loading", payload: false });
      }
    },
    [dispatch]
  );

  //si hay token llama a /api/auth/me
  //actualiza el user en store y localStorage EDITAR
  //Si falla el token resetea la sesion
  const refreshMe = useCallback(async () => {
    if (!store.token) return;
    dispatch({ type: "auth_loading", payload: true });
    try {
      const me = await api("/api/auth/me");
      dispatch({ type: "auth_set", payload: { token: store.token, user: me } });
      localStorage.setItem("mv_user", JSON.stringify(me));
    } catch {
      localStorage.removeItem("mv_token");
      localStorage.removeItem("mv_user");
      dispatch({ type: "auth_clear" });
    } finally {
      dispatch({ type: "auth_loading", payload: false });
    }
  }, [store.token, dispatch]);


  //limpia todo lo  guardado y vuelve todo al estado global
  const logout = useCallback(() => {
    localStorage.removeItem("mv_token");
    localStorage.removeItem("mv_user");
    dispatch({ type: "auth_clear" });
  }, [dispatch]);

  //retorno del hook

  return { user, token, loading, error, login, register, refreshMe, logout };
}
