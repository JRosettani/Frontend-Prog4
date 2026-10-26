import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { obtenerUnoPorId } from "../services/categoria";
import Aviso from "../components/aviso";
import { IconoReintentar, IconoVolver } from "../components/iconos";
import { botonSecundario, inicial, panel } from "../components/estilos";

function Esqueleto() {
  return (
    <div role="status" aria-live="polite" className={`${panel} p-6 sm:p-8`}>
      <span className="sr-only">Cargando categoría…</span>
      <div aria-hidden="true" className="flex items-center gap-5">
        <span className="size-16 shrink-0 rounded-lg bg-content motion-safe:animate-pulse" />
        <span className="flex-1 space-y-3">
          <span className="block h-3 w-20 rounded bg-content motion-safe:animate-pulse" />
          <span className="block h-6 w-1/2 rounded bg-content motion-safe:animate-pulse" />
        </span>
      </div>
    </div>
  );
}

export default function Categoria() {
  const { id } = useParams();
  const [intento, setIntento] = useState(0);
  const [estado, setEstado] = useState({
    id: null,
    intento: 0,
    cat: null,
    error: null,
  });

  useEffect(() => {
    let vigente = true;

    obtenerUnoPorId(id)
      .then((res) => {
        if (vigente) setEstado({ id, intento, cat: res.datos ?? null, error: null });
      })
      .catch((error) => {
        if (!vigente) return;
        const noExiste = error?.response?.status === 404;
        setEstado({
          id,
          intento,
          cat: null,
          error: noExiste ? "no-encontrada" : "red",
        });
      });

    return () => {
      vigente = false;
    };
  }, [id, intento]);

  // Mientras la respuesta guardada no corresponda a este id, se está cargando.
  const cargando = estado.id !== id || estado.intento !== intento;
  const { cat, error } = estado;
  const noEncontrada = !cargando && (error === "no-encontrada" || (!error && !cat));

  return (
    <article>
      <Link
        href="/categorias"
        className="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-ink-subtle transition-colors hover:text-ink"
      >
        <IconoVolver className="size-4" />
        Volver a categorías
      </Link>

      {cargando && <Esqueleto />}

      {!cargando && error === "red" && (
        <Aviso
          tipo="error"
          titulo="No se pudo cargar la categoría"
          accion={
            <button
              type="button"
              onClick={() => setIntento((n) => n + 1)}
              className={botonSecundario}
            >
              <IconoReintentar className="size-4" />
              Reintentar
            </button>
          }
        >
          Comprueba tu conexión con el servidor e inténtalo de nuevo.
        </Aviso>
      )}

      {noEncontrada && (
        <Aviso tipo="info" titulo="No encontramos esta categoría">
          Puede que se haya eliminado o que el enlace no sea correcto. Vuelve a
          la lista para elegir otra.
        </Aviso>
      )}

      {!cargando && cat && (
        <div className={`${panel} overflow-hidden`}>
          <div className="flex items-center gap-5 p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-lg bg-blue-dark text-3xl font-semibold text-ink"
            >
              {inicial(cat.nombre)}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-ink-subtle">Categoría</p>
              <h1 className="mt-0.5 text-3xl font-semibold tracking-tight break-words text-ink">
                {cat.nombre}
              </h1>
            </div>
          </div>

          <dl className="border-t border-line bg-content px-6 py-4 sm:px-8">
            <dt className="text-sm text-ink-subtle">Identificador</dt>
            <dd className="mt-0.5 font-medium text-ink">{cat.id ?? id}</dd>
          </dl>
        </div>
      )}
    </article>
  );
}
