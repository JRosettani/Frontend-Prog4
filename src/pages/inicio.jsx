import { Link } from "wouter";
import { IconoChevron } from "../components/iconos";
import { useAuthStore } from "../stores/auth";

const secciones = [
  {
    href: "/categorias",
    titulo: "Categorías",
    texto: "Agrupa los productos por tipo.",
    numero: "01",
  },
  {
    href: "/marcas",
    titulo: "Marcas",
    texto: "Administra las marcas del catálogo.",
    numero: "02",
  },
  {
    href: "/talles",
    titulo: "Talles",
    texto: "Define los talles disponibles.",
    numero: "03",
  },
  {
    href: "/productos",
    titulo: "Productos",
    texto: "Crea y administra los productos del catálogo.",
    numero: "04",
  },
  {
    href: "/pedidos",
    titulo: "Pedidos",
    texto: "Administra los pedidos del sistema.",
    numero: "05",
  },
];

export default function Inicio() {
  const usuario = useAuthStore((s) => s.usuario);

  return (
    <>
      {/* Hero */}
      <section className="relative border-l-2 border-ink py-2 pl-6 sm:py-6 sm:pl-10">
        <span className="absolute -left-[5px] top-0 size-2.5 bg-ink" />

        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-subtle">
          Panel de administración
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Hola, bienvenido
          {usuario?.nombre && (
            <span className="mt-1 block text-ink-muted">{usuario.nombre}</span>
          )}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
          Administra tu catálogo: crea, consulta, edita y elimina categorías,
          marcas, talles y productos.
        </p>

        <span className="mt-8 block h-px w-16 bg-ink" />
      </section>

      {/* Cards */}
      <ul className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {secciones.map(({ href, titulo, texto, numero }) => (
          <li key={href} className="bg-panel">
            <Link
              href={href}
              className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden p-6 transition-colors duration-200 hover:bg-content"
            >
              {/* Número decorativo de fondo */}
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-4 select-none text-7xl font-black text-ink/5 transition-all duration-300 group-hover:-top-2 group-hover:text-ink/10"
              >
                {numero}
              </span>

              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
                  {numero}
                </span>
                <span className="block text-lg font-semibold text-ink">
                  {titulo}
                </span>
                <span className="block text-sm leading-relaxed text-ink-muted">
                  {texto}
                </span>
              </div>

              {/* Flecha animada */}
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-ink-subtle transition-all duration-200 group-hover:gap-3 group-hover:text-ink">
                Ver más
                <IconoChevron className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>

              {/* Línea inferior que crece al hover */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
