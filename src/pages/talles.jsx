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

const COLORES_TALLE = [
  "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-300",
  "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300",
  "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
  "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-300",
  "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300",
  "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-300",
];

function colorTalle(id) {
  return COLORES_TALLE[id % COLORES_TALLE.length];
}

function EsqueletoLista() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando talles…</span>
      <ul aria-hidden="true" className="divide-y divide-line">
        {[0, 1, 2, 3].map((n) => (
          <li key={n} className="flex items-center gap-4 px-4 py-3.5">
            <span className="h-8 w-14 shrink-0 rounded-lg bg-content motion-safe:animate-pulse" />
            <span className="flex-1 space-y-2">
              <span className="block h-3.5 w-1/4 rounded bg-content motion-safe:animate-pulse" />
              <span className="block h-3 w-16 rounded bg-content motion-safe:animate-pulse" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
          className={campo}
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
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
    if (!editando) return;
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
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-ink-subtle">
          Catálogo
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Talles
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Consulta, crea, edita y elimina talles del catálogo.
        </p>
      </header>

      {exito && (
        <div className="mb-6">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* Panel alta */}
        <aside
          aria-labelledby="titulo-nuevo"
          className={`${panel} order-1 p-5 lg:order-2 lg:sticky lg:top-24`}
        >
          <h2 id="titulo-nuevo" className="text-lg font-semibold text-ink">
            Nuevo talle
          </h2>
          <p className="mt-1 text-sm text-ink-subtle">
            Puede ser una letra (S, M, XL) o un número (38, 42).
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
                className={campo}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
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
                  "No se pudo crear el talle.",
                )}
              </Aviso>
            </div>
          )}

          {/* Vista previa de todos los talles como chips */}
          {isSuccess && total > 0 && (
            <div className="mt-6 rounded-lg border border-line bg-hover/40 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-subtle">
                {total} {total === 1 ? "talle" : "talles"} registrados
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((t) => (
                  <span
                    key={t.id}
                    className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${colorTalle(t.id)}`}
                  >
                    {t.nombre}
                  </span>
                ))}
              </div>
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
                titulo="No se pudieron cargar los talles"
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
                  className="group flex items-center gap-1 pr-2 transition-colors hover:bg-hover"
                >
                  <Link
                    href={`/talles/${item.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4 px-4 py-3.5 focus-visible:-outline-offset-2"
                  >
                    {/* Chip de talle en vez de avatar */}
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-8 min-w-14 shrink-0 items-center justify-center rounded-lg border px-2 text-sm font-bold tracking-wide transition-transform duration-150 group-hover:scale-105 ${colorTalle(item.id)}`}
                    >
                      {item.nombre}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">
                        {item.nombre}
                      </span>
                      <span className="block text-xs text-ink-subtle">
                        ID {item.id}
                      </span>
                    </span>

                    <IconoChevron className="size-4 shrink-0 text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>

                  <div className="flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => abrirEditar(item)}
                      aria-label={`Editar ${item.nombre}`}
                      title="Editar"
                      className={botonIcono}
                    >
                      <IconoEditar className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => abrirBorrar(item)}
                      aria-label={`Eliminar ${item.nombre}`}
                      title="Eliminar"
                      className={`${botonIcono} hover:text-red-500`}
                    >
                      <IconoPapelera className="size-4" />
                    </button>
                  </div>
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
                  "No se pudo actualizar el talle.",
                )}
              </Aviso>
            )}
          </div>
        )}
      </Dialogo>

      {/* Diálogo: eliminar */}
      <Dialogo
        id="dialogo-eliminar"
        abierto={borrando != null}
        onCerrar={cerrarBorrar}
        titulo="Eliminar talle"
      >
        {borrando && (
          <div className="space-y-4">
            <p className="text-ink-muted">
              ¿Seguro que querés eliminar el talle{" "}
              <strong className="break-words font-semibold text-ink">
                "{borrando.nombre}"
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            {mutationEliminar.isError && (
              <Aviso tipo="error">
                {mensajeError(
                  mutationEliminar.error,
                  "No se pudo eliminar el talle.",
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
