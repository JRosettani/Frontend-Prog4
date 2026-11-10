import { Link } from "wouter";
import { IconoChevron } from "../components/iconos";
import { panel } from "../components/estilos";
import { useAuthStore } from "../stores/auth";

const secciones = [
  {
    href: "/categorias",
    titulo: "Categorías",
    texto: "Agrupa los productos por tipo.",
  },
  {
    href: "/marcas",
    titulo: "Marcas",
    texto: "Administra las marcas del catálogo.",
  },
  {
    href: "/talles",
    titulo: "Talles",
    texto: "Define los talles disponibles.",
  },
];

export default function Inicio() {
  const usuario = useAuthStore((s) => s.usuario);

  return (
    <>
      <section className="border-l-4 border-accent py-2 pl-6 sm:py-4 sm:pl-10">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Hola, bienvenido
          {usuario?.nombre && ` ${usuario.nombre}`}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
          Administra tu catálogo: crea, consulta, edita y elimina categorías,
          marcas y talles.
        </p>
      </section>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {secciones.map(({ href, titulo, texto }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${panel} group flex h-full flex-col gap-1 p-5 transition-colors hover:border-ink hover:bg-content`}
            >
              <span className="flex items-center justify-between font-semibold text-ink">
                {titulo}
                <IconoChevron className="size-5 text-ink-subtle transition-colors group-hover:text-ink" />
              </span>
              <span className="text-sm text-ink-muted">{texto}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
