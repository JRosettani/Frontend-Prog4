import { Link, useLocation } from "wouter";
import { IconoEtiqueta } from "./iconos";
import { useAuthStore } from "../stores/auth";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/categorias", texto: "Categorías" },
  { href: "/marcas", texto: "Marcas" },
  { href: "/talles", texto: "Talles" },
  { href: "/productos", texto: "Productos" },
];

function estaActivo(href, ubicacion) {
  const actual = ubicacion.toLowerCase();
  if (href === "/") return actual === "/";
  return actual === href || actual.startsWith(`${href}/`);
}

export default function Navbar() {
  const [ubicacion] = useLocation();
  const { isAuthenticated, usuario, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-panel/80 backdrop-blur-sm">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:gap-6 sm:px-6"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-1 py-1 font-semibold text-ink transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="grid size-7 place-items-center rounded-md bg-accent text-on-accent shadow-sm">
            <IconoEtiqueta className="size-4" />
          </span>
          <span className="hidden sm:inline">Catálogo</span>
        </Link>

        {isAuthenticated && (
          <span aria-hidden="true" className="h-5 w-px bg-line" />
        )}

        {/* Links de navegación */}
        {isAuthenticated && (
          <ul className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            {enlaces.map(({ href, texto }) => {
              const activo = estaActivo(href, ubicacion);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={activo ? "page" : undefined}
                    className={`
                      relative block rounded-lg px-3 py-1.5 text-sm font-medium
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                      ${activo
                        ? "bg-accent text-on-accent shadow-sm"
                        : "text-ink-muted hover:bg-hover hover:text-ink active:scale-95"
                      }
                    `}
                  >
                    {texto}
                    {/* Underline indicator on hover (solo inactivos) */}
                    {!activo && (
                      <span className="absolute inset-x-3 bottom-0.5 h-px scale-x-0 rounded-full bg-accent/60 transition-transform duration-150 group-hover:scale-x-100" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Usuario + logout */}
        {isAuthenticated && (
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* Chip del usuario */}
            <span className="hidden items-center gap-2 rounded-full border border-line bg-content px-3 py-1 sm:flex">
              <span className="size-2 rounded-full bg-green-500" aria-hidden="true" />
              <span className="text-sm text-ink-muted">{usuario?.nombre}</span>
            </span>

            {/* Botón salir */}
            <button
              type="button"
              onClick={logout}
              className="
                flex items-center gap-1.5 rounded-lg border border-line
                bg-content px-3 py-1.5 text-sm font-medium text-ink-muted
                shadow-sm transition-all duration-150
                hover:border-red-400/60 hover:bg-red-50 hover:text-red-600
                active:scale-95
                dark:hover:bg-red-950/40 dark:hover:text-red-400
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5" aria-hidden="true">
                <path fillRule="evenodd" d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H6.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
              Salir
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}