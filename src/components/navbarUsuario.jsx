import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../stores/auth";
import { useCarritoStore } from "../stores/carrito";

const enlaces = [
  { href: "/home", texto: "Inicio" },
  { href: "/catalogo", texto: "Productos" },
  { href: "/mis-pedidos", texto: "Pedidos" },
];

function estaActivo(href, ubicacion) {
  const actual = ubicacion.toLowerCase();
  if (href === "/home") return actual === "/home";
  return actual === href || actual.startsWith(`${href}/`);
}

export default function NavbarUsuario() {
  const [ubicacion] = useLocation();
  const { usuario, logout } = useAuthStore();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cantidadCarrito = useCarritoStore((s) =>
    s.items.reduce((suma, i) => suma + i.cantidad, 0),
  );

  const inicial = usuario?.nombre?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-panel/90 backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        {/* Logo */}
        <Link
          href="/home"
          className="group flex shrink-0 items-center gap-2.5 font-semibold text-ink transition-opacity hover:opacity-70"
        >
          <span className="relative flex size-7 items-center justify-center overflow-hidden bg-ink text-on-accent text-xs font-black">
            ℝ{/* Shimmer en hover */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </span>
          <span className="hidden tracking-tight sm:inline">Catálogo</span>
        </Link>

        {/* Links — solo desktop */}
        <ul className="hidden items-center sm:flex">
          {enlaces.map(({ href, texto }) => {
            const activo = estaActivo(href, ubicacion);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={activo ? "page" : undefined}
                  className={`group relative block px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    activo ? "text-ink" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  {texto}
                  <span
                    className={`absolute bottom-0 left-0 h-px w-full origin-left bg-ink transition-transform duration-200 ${
                      activo
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Derecha */}
        <div className="flex items-center gap-2">
          {/* Carrito */}
          <Link
            href="/carrito"
            aria-label={`Carrito, ${cantidadCarrito} ${cantidadCarrito === 1 ? "unidad" : "unidades"}`}
            className="relative grid size-9 place-items-center border border-line text-ink-muted transition-all duration-200 hover:border-ink hover:text-ink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {cantidadCarrito > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center bg-ink px-1 text-[0.6rem] font-bold leading-4 text-on-accent">
                {cantidadCarrito}
              </span>
            )}
          </Link>

          {/* Avatar → perfil */}
          <Link
            href="/perfil"
            aria-label="Ver perfil"
            className="group flex items-center gap-2 border border-line px-2 py-1 text-xs text-ink-muted transition-all duration-200 hover:border-ink hover:text-ink"
          >
            <span className="relative grid size-6 shrink-0 place-items-center overflow-hidden bg-ink text-on-accent text-xs font-bold">
              {inicial}
              <span className="absolute inset-0 bg-white/0 transition-colors duration-200 group-hover:bg-white/10" />
            </span>
            <span className="hidden max-w-24 truncate text-[0.65rem] tracking-[0.15em] uppercase sm:block">
              {usuario?.nombre}
            </span>
          </Link>

          {/* Salir — solo desktop */}
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="group hidden items-center gap-1.5 border border-line px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-widest text-ink-muted transition-all duration-200 hover:border-ink hover:text-ink active:scale-95 sm:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H6.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
            Salir
          </button>

          {/* Hamburguesa — solo mobile */}
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
            aria-expanded={menuAbierto}
            className="grid size-9 place-items-center border border-line text-ink-muted transition-all hover:border-ink hover:text-ink active:scale-95 sm:hidden"
          >
            <span className="relative flex size-4 flex-col items-center justify-center gap-[4px]">
              <span
                className={`block h-px w-4 bg-current transition-all duration-300 ${menuAbierto ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${menuAbierto ? "w-0 opacity-0" : "w-3"}`}
              />
              <span
                className={`block h-px w-4 bg-current transition-all duration-300 ${menuAbierto ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Menú mobile desplegable */}
      <div
        className={`overflow-hidden border-t border-line bg-panel transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:hidden ${
          menuAbierto ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-0.5 px-4 pt-3">
          {enlaces.map(({ href, texto }) => {
            const activo = estaActivo(href, ubicacion);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuAbierto(false)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                    activo ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {texto}
                  <span
                    className={`h-px origin-left bg-ink transition-all duration-200 ${activo ? "w-4" : "w-0 group-hover:w-4"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mx-4 mt-2 border-t border-line pb-4 pt-3">
          <button
            type="button"
            onClick={() => {
              logout();
              setMenuAbierto(false);
            }}
            className="group flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H6.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
              Cerrar sesión
            </span>
            <span className="h-px w-0 bg-ink transition-all duration-200 group-hover:w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
