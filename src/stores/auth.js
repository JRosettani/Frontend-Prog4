import { create } from "zustand";
import { persist } from "zustand/middleware";

const handler = (set, get) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,

  login: (data) =>
    set({ token: data.token, usuario: data.usuario, isAuthenticated: true }),
  logout: () => set({ token: null, usuario: null, isAuthenticated: false }),

  // true si el primer rol es "Admin"
  esAdmin: () => get().usuario?.roles?.[0]?.nombre === "Admin",
});

export const useAuthStore = create(persist(handler, { name: "auth-store" }));
