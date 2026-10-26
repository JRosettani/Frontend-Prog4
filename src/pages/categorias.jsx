import { useEffect, useState } from "react";
import z from "zod";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { obtenerTodos, crearUno } from "../services/categoria";
import Aviso from "../components/aviso";
import { IconoAlerta, IconoChevron, IconoReintentar } from "../components/iconos";
import { botonPrimario, botonSecundario, inicial, panel } from "../components/estilos";

const categoriaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

function EsqueletoLista() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando categorías…</span>
      <ul aria-hidden="true" className="divide-y divide-line">
        {[0, 1, 2, 3].map((n) => (
          <li key={n} className="flex items-center gap-4 px-4 py-3">
            <span className="size-10 shrink-0 rounded-md bg-content motion-safe:animate-pulse" />
            <span className="flex-1 space-y-2">
              <span className="block h-3.5 w-1/3 rounded bg-content motion-safe:animate-pulse" />
              <span className="block h-3 w-16 rounded bg-content motion-safe:animate-pulse" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Categorias() {
  const [lista, setLista] = useState({ estado: "cargando", categorias: [] });
  const [recarga, setRecarga] = useState(0);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let vigente = true;

    obtenerTodos()
      .then(({ datos }) => {
        if (!Array.isArray(datos)) {
          throw new TypeError("La respuesta de categorías no contiene una lista");
        }
        if (vigente) setLista({ estado: "listo", categorias: datos });
      })
      .catch((error) => {
        console.error("No se pudieron cargar las categorías:", error);
        if (vigente) setLista({ estado: "error", categorias: [] });
      });

    return () => {
      vigente = false;
    };
  }, [recarga]);

  const reintentar = () => {
    setLista({ estado: "cargando", categorias: [] });
    setRecarga((n) => n + 1);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { nombre: "" },
  });

  const onSubmit = async (data) => {
    setResultado(null);
    const cat = {
      ...data,
      nombre: data.nombre,
    };

    try {
      const res = await crearUno(cat);
      setResultado({ tipo: "exito", texto: res?.mensaje ?? "Categoría creada." });
      reset();
      setRecarga((n) => n + 1); // vuelve a pedir la lista para mostrar la nueva
    } catch (error) {
      console.error("No se pudo crear la categoría:", error);
      setResultado({
        tipo: "error",
        texto: "No se pudo crear la categoría. Revisa tu conexión e inténtalo de nuevo.",
      });
    }
  };

  const { estado, categorias } = lista;
  const total = categorias.length;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Categorías
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Elige una categoría para ver su detalle o crea una nueva.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* Alta de categoría: arriba en móvil, a la derecha en escritorio */}
        <aside
          aria-labelledby="titulo-nueva"
          className={`${panel} order-1 p-5 lg:order-2 lg:sticky lg:top-24`}
        >
          <h2 id="titulo-nueva" className="text-lg font-semibold text-ink">
            Nueva categoría
          </h2>
          <p className="mt-1 text-sm text-ink-subtle">
            Ponle un nombre claro; después la verás en la lista.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor="nombre"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                autoComplete="off"
                placeholder="Ej.: Bebidas"
                aria-invalid={errors.nombre ? "true" : "false"}
                aria-describedby={errors.nombre ? "nombre-error" : undefined}
                className="block w-full rounded-md border border-line bg-deep px-3 py-2.5 text-ink placeholder:text-ink-subtle hover:border-ink-subtle focus:border-blue-light aria-invalid:border-ink"
                {...register("nombre")}
              />
              {errors.nombre && (
                <p
                  id="nombre-error"
                  className="mt-2 flex items-start gap-1.5 text-sm text-ink"
                >
                  <IconoAlerta className="mt-0.5 size-4 shrink-0 text-blue-light" />
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${botonPrimario} w-full`}
            >
              {isSubmitting ? "Creando…" : "Crear categoría"}
            </button>
          </form>

          {resultado && (
            <div className="mt-4">
              <Aviso tipo={resultado.tipo}>{resultado.texto}</Aviso>
            </div>
          )}
        </aside>

        {/* Listado */}
        <section
          aria-labelledby="titulo-lista"
          aria-busy={estado === "cargando"}
          className={`${panel} order-2 overflow-hidden lg:order-1`}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id="titulo-lista" className="font-semibold text-ink">
              Categorías existentes
            </h2>
            {estado === "listo" && (
              <span className="rounded-full border border-line bg-content px-2.5 py-0.5 text-sm text-ink-muted">
                {total}
              </span>
            )}
          </div>

          {estado === "cargando" && <EsqueletoLista />}

          {estado === "error" && (
            <div className="p-4">
              <Aviso
                tipo="error"
                titulo="No se pudieron cargar las categorías"
                accion={
                  <button
                    type="button"
                    onClick={reintentar}
                    className={botonSecundario}
                  >
                    <IconoReintentar className="size-4" />
                    Reintentar
                  </button>
                }
              >
                Comprueba tu conexión con el servidor e inténtalo de nuevo.
              </Aviso>
            </div>
          )}

          {estado === "listo" && total === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-ink">Aún no hay categorías</p>
              <p className="mt-1 text-sm text-ink-subtle">
                Crea la primera con el formulario.
              </p>
            </div>
          )}

          {estado === "listo" && total > 0 && (
            <ul className="divide-y divide-line">
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categorias/${cat.id}`}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-hover focus-visible:-outline-offset-2"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-md bg-blue-dark text-base font-semibold text-ink"
                    >
                      {inicial(cat.nombre)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">
                        {cat.nombre}
                      </span>
                      <span className="block text-sm text-ink-subtle">
                        ID {cat.id}
                      </span>
                    </span>
                    <IconoChevron className="size-5 shrink-0 text-ink-subtle transition-colors group-hover:text-blue-light" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
