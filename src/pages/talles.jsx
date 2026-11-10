import { useEffect, useState } from "react";
import { Link } from "wouter";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarUnoPorId,
  crearUno,
  eliminarUnoPorId,
  obtenerTodos,
} from "../services/talle";
import Aviso from "../components/aviso";
import Dialogo from "../components/dialogo";
import {
  IconoAlerta,
  IconoChevron,
  IconoEditar,
  IconoPapelera,
  IconoReintentar,
} from "../components/iconos";
import {
  botonIcono,
  botonPrimario,
  botonSecundario,
  campo,
  inicial,
  panel,
} from "../components/estilos";
import { mensajeError } from "../lib/errores";

const talleSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Escribe un talle")
    .max(20, "El nombre no puede superar los 20 caracteres"),
});

function EsqueletoLista() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando talles…</span>
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

// Formulario del diálogo de edición (se monta solo mientras el diálogo está abierto).
function FormularioEdicion({ item, guardando, onGuardar, onCancelar }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(talleSchema),
    defaultValues: { nombre: item.nombre },
  });

  return (
    <form onSubmit={handleSubmit(onGuardar)} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="nombre-edicion"
          className="mb-1.5 block text-sm font-medium text-ink-muted"
        >
          Nombre
        </label>
        <input
          type="text"
          id="nombre-edicion"
          autoComplete="off"
          placeholder="Ej.: M, XL, 42"
          data-autofocus
          aria-invalid={errors.nombre ? "true" : "false"}
          aria-describedby={errors.nombre ? "nombre-edicion-error" : undefined}
          className={campo}
          {...register("nombre")}
        />
        {errors.nombre && (
          <p
            id="nombre-edicion-error"
            className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink"
          >
            <IconoAlerta className="mt-0.5 size-4 shrink-0" />
            {errors.nombre.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className={botonSecundario}
        >
          Cancelar
        </button>
        <button type="submit" disabled={guardando} className={botonPrimario}>
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

export default function Talles() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["talles"],
    queryFn: obtenerTodos,
  });

  const items = Array.isArray(data?.datos) ? data.datos : [];
  const total = items.length;

  const [exito, setExito] = useState(null);
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  // El aviso de éxito se retira solo; los errores quedan hasta la siguiente acción.
  useEffect(() => {
    if (!exito) return;
    const t = setTimeout(() => setExito(null), 5000);
    return () => clearTimeout(t);
  }, [exito]);

  // ---- Alta ----
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(talleSchema),
    defaultValues: { nombre: "" },
  });

  const mutationCrear = useMutation({
    mutationKey: ["crearTalle"],
    mutationFn: crearUno,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["talles"] });
      setExito(data?.mensaje ?? "Talle creado.");
      reset();
    },
  });

  const onSubmit = (data) => {
    setExito(null);
    mutationCrear.mutate(data);
  };

  // ---- Edición ----
  const mutationEditar = useMutation({
    mutationKey: ["editarTalle"],
    mutationFn: ({ id, datos }) => actualizarUnoPorId(id, datos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["talles"] });
      setEditando(null);
      setExito(data?.mensaje ?? "Talle actualizado.");
    },
  });

  const abrirEditar = (item) => {
    setExito(null);
    mutationEditar.reset();
    setEditando(item);
  };

  const cerrarEditar = () => {
    mutationEditar.reset();
    setEditando(null);
  };

  const guardarEdicion = (datos) => {
    // La guarda evita leer propiedades de un valor que puede ser null.
    if (!editando) return;
    // Sin cambios no hace falta molestar al servidor.
    if (datos.nombre === editando.nombre) return cerrarEditar();
    mutationEditar.mutate({
      id: editando.id,
      datos: { id: editando.id, ...datos },
    });
  };

  // ---- Baja ----
  const mutationEliminar = useMutation({
    mutationKey: ["eliminarTalle"],
    mutationFn: eliminarUnoPorId,
    onSuccess: (data, id) => {
      queryClient.removeQueries({ queryKey: ["talles", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["talles"], exact: true });
      setBorrando(null);
      setExito(data?.mensaje ?? "Talle eliminado.");
    },
  });

  const abrirBorrar = (item) => {
    setExito(null);
    mutationEliminar.reset();
    setBorrando(item);
  };

  const cerrarBorrar = () => {
    mutationEliminar.reset();
    setBorrando(null);
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Talles
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Consulta, crea, edita y elimina talles.
        </p>
      </header>

      {exito && (
        <div className="mb-6">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* Alta: arriba en móvil, a la derecha en escritorio */}
        <aside
          aria-labelledby="titulo-nuevo"
          className={`${panel} order-1 p-5 lg:order-2 lg:sticky lg:top-24`}
        >
          <h2 id="titulo-nuevo" className="text-lg font-semibold text-ink">
            Nuevo talle
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
                placeholder="Ej.: M, XL, 42"
                aria-invalid={errors.nombre ? "true" : "false"}
                aria-describedby={errors.nombre ? "nombre-error" : undefined}
                className={campo}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p
                  id="nombre-error"
                  className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink"
                >
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutationCrear.isPending}
              className={`${botonPrimario} w-full`}
            >
              {mutationCrear.isPending ? "Creando…" : "Crear talle"}
            </button>
          </form>

          {mutationCrear.isError && (
            <div className="mt-4">
              <Aviso tipo="error">
                {mensajeError(
                  mutationCrear.error,
                  "No se pudo crear el talle. Inténtalo de nuevo.",
                )}
              </Aviso>
            </div>
          )}
        </aside>

        {/* Listado */}
        <section
          aria-labelledby="titulo-lista"
          aria-busy={isLoading}
          className={`${panel} order-2 overflow-hidden lg:order-1`}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id="titulo-lista" className="font-semibold text-ink">
              Talles existentes
            </h2>
            {isSuccess && (
              <span className="rounded-full border border-line bg-content px-2.5 py-0.5 text-sm text-ink-muted">
                {total}
              </span>
            )}
          </div>

          {isLoading && <EsqueletoLista />}

          {isError && (
            <div className="p-4">
              <Aviso
                tipo="error"
                titulo="No se pudieron cargar las talles"
                accion={
                  <button
                    type="button"
                    onClick={() => refetch()}
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

          {isSuccess && total === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-ink">Aún no hay talles</p>
              <p className="mt-1 text-sm text-ink-subtle">
                Crea el primero con el formulario.
              </p>
            </div>
          )}

          {isSuccess && total > 0 && (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-1 pr-2 transition-colors hover:bg-hover"
                >
                  <Link
                    href={`/talles/${item.id}`}
                    className="group flex min-w-0 flex-1 items-center gap-4 px-4 py-3 focus-visible:-outline-offset-2"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-base font-semibold text-on-accent"
                    >
                      {inicial(item.nombre)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">
                        {item.nombre}
                      </span>
                      <span className="block text-sm text-ink-subtle">
                        ID {item.id}
                      </span>
                    </span>
                    <IconoChevron className="size-5 shrink-0 text-ink-subtle transition-colors group-hover:text-ink" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => abrirEditar(item)}
                    aria-label={`Editar talle ${item.nombre}`}
                    title="Editar"
                    className={botonIcono}
                  >
                    <IconoEditar className="size-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirBorrar(item)}
                    aria-label={`Eliminar talle ${item.nombre}`}
                    title="Eliminar"
                    className={botonIcono}
                  >
                    <IconoPapelera className="size-4.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Diálogo: editar */}
      <Dialogo
        id="dialogo-editar"
        abierto={editando != null}
        onCerrar={cerrarEditar}
        titulo="Editar talle"
      >
        {editando && (
          <div className="space-y-4">
            <FormularioEdicion
              item={editando}
              guardando={mutationEditar.isPending}
              onGuardar={guardarEdicion}
              onCancelar={cerrarEditar}
            />
            {mutationEditar.isError && (
              <Aviso tipo="error">
                {mensajeError(
                  mutationEditar.error,
                  "No se pudo actualizar el talle. Inténtalo de nuevo.",
                )}
              </Aviso>
            )}
          </div>
        )}
      </Dialogo>

      {/* Diálogo: confirmar eliminación */}
      <Dialogo
        id="dialogo-eliminar"
        abierto={borrando != null}
        onCerrar={cerrarBorrar}
        titulo="Eliminar talle"
      >
        {borrando && (
          <div className="space-y-4">
            <p className="text-ink-muted">
              ¿Seguro que quieres eliminar el talle{" "}
              <strong className="font-semibold break-words text-ink">
                “{borrando.nombre}”
              </strong>
              ? Esta acción no se puede deshacer.
            </p>

            {mutationEliminar.isError && (
              <Aviso tipo="error">
                {mensajeError(
                  mutationEliminar.error,
                  "No se pudo eliminar el talle. Inténtalo de nuevo.",
                )}
              </Aviso>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                data-autofocus
                onClick={cerrarBorrar}
                disabled={mutationEliminar.isPending}
                className={botonSecundario}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => mutationEliminar.mutate(borrando.id)}
                disabled={mutationEliminar.isPending}
                className={botonPrimario}
              >
                {mutationEliminar.isPending ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        )}
      </Dialogo>
    </>
  );
}
