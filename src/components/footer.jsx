import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKvFcZ8s1LJ1PECOcJYS1IkqVkwalCRAJUgpc6AA75Zw&s"
                alt="Logo"
                className="size-6 object-contain dark:invert"
              />
              <span className="text-sm font-bold tracking-tight text-ink">
                Catálogo
              </span>
            </div>
            <p className="text-xs leading-relaxed text-ink-subtle">
              Ropa formal de alta confección. <br />
              Elegancia que habla por sí sola.
            </p>
          </div>

          {/* Navegación */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
              Navegación
            </p>
            <ul className="space-y-2">
              {[
                { href: "/home", label: "Inicio" },
                { href: "/catalogo", label: "Productos" },
                { href: "/mis-pedidos", label: "Mis pedidos" },
                { href: "/perfil", label: "Mi perfil" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-ink-muted transition-colors hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
              Contacto
            </p>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-3.5 shrink-0 text-ink-subtle"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <span>anonimous@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-3.5 shrink-0 text-ink-subtle"
                >
                  <path
                    fillRule="evenodd"
                    d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Catálogo. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
