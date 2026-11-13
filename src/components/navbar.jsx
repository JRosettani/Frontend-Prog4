import { Link, useLocation } from "wouter";
import { IconoEtiqueta } from "./iconos";
import { useAuthStore } from "../stores/auth";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/categorias", texto: "Categorías" },
  { href: "/marcas", texto: "Marcas" },
  { href: "/talles", texto: "Talles" },
  { href: "/productos", texto: "Productos" },
  { href: "/pedidos", texto: "Pedidos" },
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
          className="flex items-center gap-2.5 px-1 py-1 font-semibold text-ink transition-colors hover:opacity-70"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKvFcZ8s1LJ1PECOcJYS1IkqVkwalCRAJUgpc6AA75Zw&s"
            alt="Logo"
            className="size-7 object-contain dark:invert"
          />
          <span className="hidden tracking-tight sm:inline">Catálogo</span>
        </Link>

        {isAuthenticated && (
          <span aria-hidden="true" className="h-5 w-px bg-line" />
        )}

        {/* Links de navegación */}
        {isAuthenticated && (
          <ul className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {enlaces.map(({ href, texto }) => {
              const activo = estaActivo(href, ubicacion);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={activo ? "page" : undefined}
                    className={`
                      group relative block px-3 py-1.5 text-sm font-medium
                      transition-colors duration-150
                      ${activo ? "text-ink" : "text-ink-subtle hover:text-ink"}
                    `}
                  >
                    {texto}
                    {/* Línea inferior animada */}
                    <span
                      className={`
                      absolute bottom-0 left-0 h-px w-full
                      origin-left transition-transform duration-200
                      bg-ink
                      ${activo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                    `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Usuario + logout */}
        {isAuthenticated && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {/* Chip del usuario */}
            <span className="hidden items-center gap-2 border border-line px-3 py-1 sm:flex">
              <span className="size-1.5 bg-green-500" aria-hidden="true" />
              <span className="text-xs tracking-wide text-ink-muted uppercase">
                {usuario?.nombre}
              </span>
            </span>

            {/* Botón salir */}
            <button
              type="button"
              onClick={logout}
              className="
                flex items-center gap-1.5 border border-line
                px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-ink-muted
                transition-all duration-150
                hover:border-ink hover:text-ink
                active:scale-95
              "
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
          </div>
        )}
      </nav>
    </header>
  );
}
