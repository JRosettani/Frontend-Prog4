import { Link, useLocation } from "wouter";
import { IconoEtiqueta } from "./iconos";
import { useAuthStore } from "../stores/auth";
import { botonSecundario } from "./estilos";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/categorias", texto: "Categorías" },
  { href: "/marcas", texto: "Marcas" },
  { href: "/talles", texto: "Talles" },
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
    <header className="sticky top-0 z-10 border-b border-line bg-panel">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:gap-6 sm:px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md font-semibold text-ink"
        >
          <span className="grid size-7 place-items-center rounded-md bg-accent text-on-accent">
            <IconoEtiqueta className="size-4" />
          </span>
          <span className="hidden sm:inline">Catálogo</span>
        </Link>

        {isAuthenticated && (
          <span aria-hidden="true" className="h-5 w-px bg-line" />
        )}

        {isAuthenticated && (
          <ul className="flex items-center gap-1 overflow-x-auto">
            {enlaces.map(({ href, texto }) => {
              const activo = estaActivo(href, ubicacion);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={activo ? "page" : undefined}
                    className={`block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      activo
                        ? "bg-accent text-on-accent"
                        : "text-ink-muted hover:bg-hover hover:text-ink"
                    }`}
                  >
                    {texto}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {isAuthenticated && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {usuario?.nombre}
            </span>
            <button
              type="button"
              onClick={logout}
              className={`${botonSecundario} !px-3 !py-1.5`}
            >
              Salir
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
