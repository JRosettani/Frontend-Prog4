import { Redirect } from "wouter";
import { useAuthStore } from "../stores/auth";

/**
 * soloAdmin=true  → solo Admin puede pasar
 * soloAdmin=false → solo Usuario normal puede pasar
 * soloAdmin=undefined → cualquier autenticado
 */
export default function RutaProtegida({ children, soloAdmin }) {
  const { isAuthenticated, esAdmin } = useAuthStore();

  if (!isAuthenticated) return <Redirect to="/login" />;

  if (soloAdmin === true && !esAdmin()) return <Redirect to="/home" />;
  if (soloAdmin === false && esAdmin()) return <Redirect to="/inicio" />;

  return children;
}
