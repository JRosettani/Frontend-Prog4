import { create } from "zustand";
import { persist } from "zustand/middleware";

const handler = (set) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,

  login: (data) =>
    set({ token: data.token, usuario: data.usuario, isAuthenticated: true }),
  logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
});

// La sesión se guarda en localStorage para sobrevivir a una recarga de página.
export const useAuthStore = create(
  persist(handler, {
    name: "auth-store",
  }),
);
