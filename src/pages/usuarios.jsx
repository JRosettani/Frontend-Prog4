import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerTodos } from "../services/usuario";
import Aviso from "../components/aviso";
import { IconoReintentar, IconoChevron } from "../components/iconos";
import { botonSecundario, campo, panel, inicial } from "../components/estilos";

export default function Usuarios() {
  const [busqueda, setBusqueda] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["usuarios"],
    queryFn: obtenerTodos,
  });

  const texto = busqueda.trim().toLowerCase();
  const usuarios = (Array.isArray(data?.datos) ? data.datos : []).filter(
    (u) =>
      !texto ||
      `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(texto),
  );

  return (
    <>
      <section className="relative mb-10 border-l-2 border-ink py-2 pl-6 sm:py-6 sm:pl-10">
        <span className="absolute -left-[5px] top-0 size-2.5 bg-ink" />
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-subtle">
          Gestión de cuentas
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Usuarios
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
          Consultá las cuentas registradas y sus perfiles.
        </p>
        <span className="mt-8 block h-px w-16 bg-ink" />
      </section>

      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o email…"
        aria-label="Buscar usuarios"
        className={`${campo} mb-6`}
      />

      <div className={`${panel} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-line bg-content/10 px-6 py-4">
          <h2 className="font-semibold text-ink">Cuentas registradas</h2>
          {!isLoading && !isError && (
            <span className="rounded-full border border-line bg-content px-3 py-0.5 text-sm font-semibold text-ink-muted">
              {usuarios.length} {usuarios.length === 1 ? "usuario" : "usuarios"}
            </span>
          )}
        </div>

        {isLoading && (
          <p role="status" className="p-6 text-ink-muted">
            Cargando usuarios…
          </p>
        )}

        {isError && (
          <div className="p-6">
            <Aviso
              tipo="error"
              titulo="No se pudieron cargar los usuarios"
              accion={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className={botonSecundario}
                >
                  <IconoReintentar className="size-4" /> Reintentar
                </button>
              }
            >
              Comprobá tu conexión con el servidor e intentá de nuevo.
            </Aviso>
          </div>
        )}

        {!isLoading && !isError && usuarios.length === 0 && (
          <p className="px-6 py-12 text-center text-ink-muted">
            {busqueda
              ? "Ningún usuario coincide con la búsqueda."
              : "Todavía no hay usuarios registrados."}
          </p>
        )}

        {usuarios.length > 0 && (
          <ul className="divide-y divide-line">
            {usuarios.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/usuarios/${u.id}`}
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-content"
                >
                  <span className="grid size-10 shrink-0 place-items-center bg-ink font-bold text-on-accent">
                    {inicial(u.nombre)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">
                      {u.nombre} {u.apellido}
                    </span>
                    <span className="block truncate text-sm text-ink-subtle">
                      {u.email}
                    </span>
                  </span>
                  <span className="hidden rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-ink-muted sm:block">
                    {(u.roles ?? []).map((r) => r.nombre).join(", ") ||
                      "Sin rol"}
                  </span>
                  <IconoChevron className="size-4 text-ink-subtle transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
