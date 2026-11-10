import axios from "axios";
import { useAuthStore } from "../stores/auth";

const base = axios.create({
  baseURL: "http://localhost:5095/api",
});

// Los endpoints están protegidos: toda petición lleva el token de la sesión.
base.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el servidor rechaza el token (vencido o inválido) se cierra la sesión y
// la app vuelve sola a la pantalla de login. El 401 del propio login (clave
// incorrecta) no cuenta: ahí no había sesión que cerrar.
base.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url ?? "";
    if (error.response?.status === 401 && !url.includes("/Auth/login")) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default base;
