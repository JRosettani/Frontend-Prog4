import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../stores/auth";

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

  const inicial = usuario?.nombre?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-panel/80 backdrop-blur-sm">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        {/* Logo */}
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2 font-semibold text-ink transition-colors hover:opacity-70"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKvFcZ8s1LJ1PECOcJYS1IkqVkwalCRAJUgpc6AA75Zw&s"
            alt="Logo"
            className="size-7 object-contain dark:invert"
          />
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
          {/* Avatar → perfil (siempre visible) */}
          <Link
            href="/perfil"
            aria-label="Ver perfil"
            className="flex items-center gap-2 border border-line px-2 py-1 text-xs text-ink-muted transition-all hover:border-primary/40 hover:text-ink"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-on-accent text-xs font-bold">
              {inicial}
            </span>
            <span className="hidden max-w-24 truncate tracking-wide uppercase sm:block">
              {usuario?.nombre}
            </span>
          </Link>

          {/* Salir — solo desktop */}
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="hidden items-center gap-1.5 border border-line px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-ink-muted transition-all hover:border-red-400/60 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:hover:bg-red-950/40 dark:hover:text-red-400 sm:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-3.5"
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
            className="grid size-9 place-items-center border border-line text-ink-muted transition-colors hover:text-ink sm:hidden"
          >
            {menuAbierto ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <div className="border-t border-line bg-panel px-4 pb-4 sm:hidden">
          <ul className="space-y-1 pt-2">
            {enlaces.map(({ href, texto }) => {
              const activo = estaActivo(href, ubicacion);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuAbierto(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      activo
                        ? "bg-content text-ink"
                        : "text-ink-muted hover:bg-hover hover:text-ink"
                    }`}
                  >
                    {texto}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 border-t border-line pt-3">
            <button
              type="button"
              onClick={() => {
                logout();
                setMenuAbierto(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H6.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
