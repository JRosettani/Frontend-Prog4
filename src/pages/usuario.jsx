import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerUnoPorId } from "../services/usuario";
import Aviso from "../components/aviso";
import { IconoChevron } from "../components/iconos";
import { panel, inicial } from "../components/estilos";

// Perfil de un usuario, solo lectura (vista del admin).
export default function Usuario() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["usuarios", id],
    queryFn: () => obtenerUnoPorId(id),
  });
  const usuario = data?.datos ?? null;

  const datos = usuario
    ? [
        { etiqueta: "Nombre", valor: usuario.nombre },
        { etiqueta: "Apellido", valor: usuario.apellido },
        { etiqueta: "Correo electrónico", valor: usuario.email },
        {
          etiqueta: "Rol",
          valor: (usuario.roles ?? []).map((r) => r.nombre).join(", ") || "—",
        },
      ]
    : [];

  return (
    <>
      <Link
        href="/usuarios"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <IconoChevron className="size-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />{" "}
        Volver a usuarios
      </Link>

      {isLoading && (
        <p role="status" className="py-10 text-ink-muted">
          Cargando usuario…
        </p>
      )}

      {isError && (
        <Aviso tipo="error" titulo="No se encontró el usuario">
          Puede que haya sido eliminado o que el id no sea válido.
        </Aviso>
      )}

      {usuario && (
        <div className={`${panel} max-w-xl overflow-hidden`}>
          <div className="flex items-center gap-4 border-b border-line bg-content/10 px-6 py-5">
            <span className="grid size-12 shrink-0 place-items-center bg-ink text-lg font-bold text-on-accent">
              {inicial(usuario.nombre)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight text-ink">
                {usuario.nombre} {usuario.apellido}
              </h1>
              <p className="text-xs uppercase tracking-widest text-ink-subtle">
                Perfil · solo lectura
              </p>
            </div>
          </div>

          <dl className="divide-y divide-line">
            {datos.map(({ etiqueta, valor }) => (
              <div
                key={etiqueta}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {etiqueta}
                </dt>
                <dd className="break-all font-medium text-ink">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  );
}
