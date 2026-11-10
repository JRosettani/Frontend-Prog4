import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarUnoPorId,
  eliminarUnoPorId,
  obtenerUnoPorId,
} from "../services/marca";
import Aviso from "../components/aviso";
import Dialogo from "../components/dialogo";
import {
  IconoAlerta,
  IconoEditar,
  IconoPapelera,
  IconoReintentar,
  IconoVolver,
} from "../components/iconos";
import {
  botonPrimario,
  botonSecundario,
  campo,
  inicial,
  panel,
} from "../components/estilos";
import { mensajeError } from "../lib/errores";

const marcaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

function Esqueleto() {
  return (
    <div role="status" aria-live="polite" className={`${panel} p-6 sm:p-8`}>
      <span className="sr-only">Cargando marca…</span>
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

// Formulario del diálogo de edición (se monta solo mientras el diálogo está abierto).
function FormularioEdicion({ item, guardando, onGuardar, onCancelar }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(marcaSchema),
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
          placeholder="Ej.: Nike"
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

export default function Marca() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["marcas", id],
    queryFn: () => obtenerUnoPorId(id),
    // Un 404 no mejora al reintentar.
    retry: (intentos, err) => err?.response?.status !== 404 && intentos < 1,
  });

  const item = data?.datos ?? null;
  const noEncontrado =
    (isError && error?.response?.status === 404) ||
    (!isLoading && !isError && !item);
  const errorDeRed = isError && !noEncontrado;

  const [exito, setExito] = useState(null);
  const [editando, setEditando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  // ---- Edición ----
  const mutationEditar = useMutation({
    mutationKey: ["editarMarca"],
    mutationFn: ({ id, datos }) => actualizarUnoPorId(id, datos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["marcas"] });
      setEditando(false);
      setExito(data?.mensaje ?? "Marca actualizada.");
    },
  });

  const abrirEditar = () => {
    setExito(null);
    mutationEditar.reset();
    setEditando(true);
  };

  const cerrarEditar = () => {
    mutationEditar.reset();
    setEditando(false);
  };

  const guardarEdicion = (datos) => {
    // La guarda evita leer propiedades de un valor que puede ser null.
    if (!item) return;
    // Sin cambios no hace falta molestar al servidor.
    if (datos.nombre === item.nombre) return cerrarEditar();
    mutationEditar.mutate({ id: item.id, datos: { id: item.id, ...datos } });
  };

  // ---- Baja ----
  const mutationEliminar = useMutation({
    mutationKey: ["eliminarMarca"],
    mutationFn: eliminarUnoPorId,
    onSuccess: (_data, idEliminado) => {
      queryClient.removeQueries({ queryKey: ["marcas", String(idEliminado)] });
      queryClient.invalidateQueries({ queryKey: ["marcas"], exact: true });
      navigate("/marcas");
    },
  });

  const abrirBorrar = () => {
    setExito(null);
    mutationEliminar.reset();
    setBorrando(true);
  };

  const cerrarBorrar = () => {
    mutationEliminar.reset();
    setBorrando(false);
  };

  return (
    <article>
      <Link
        href="/marcas"
        className="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-ink-subtle transition-colors hover:text-ink"
      >
        <IconoVolver className="size-4" />
        Volver a marcas
      </Link>

      {exito && (
        <div className="mb-6">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      {isLoading && <Esqueleto />}

      {errorDeRed && (
        <Aviso
          tipo="error"
          titulo="No se pudo cargar esta marca"
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
      )}

      {noEncontrado && (
        <Aviso tipo="info" titulo="No encontramos esta marca">
          Puede que se haya eliminado o que el enlace no sea correcto. Vuelve a
          la lista para elegir otra.
        </Aviso>
      )}

      {!noEncontrado && item && (
        <div className={`${panel} overflow-hidden`}>
          <div className="flex flex-wrap items-center gap-5 p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-lg bg-accent text-3xl font-semibold text-on-accent"
            >
              {inicial(item.nombre)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-subtle">Marca</p>
              <h1 className="mt-0.5 text-3xl font-semibold tracking-tight break-words text-ink">
                {item.nombre}
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={abrirEditar}
                className={botonSecundario}
              >
                <IconoEditar className="size-4" />
                Editar
              </button>
              <button
                type="button"
                onClick={abrirBorrar}
                className={botonSecundario}
              >
                <IconoPapelera className="size-4" />
                Eliminar
              </button>
            </div>
          </div>

          <dl className="border-t border-line bg-content px-6 py-4 sm:px-8">
            <dt className="text-sm text-ink-subtle">Identificador</dt>
            <dd className="mt-0.5 font-medium text-ink">{item.id ?? id}</dd>
          </dl>
        </div>
      )}

      {/* Diálogo: editar */}
      <Dialogo
        id="dialogo-editar"
        abierto={editando && item != null}
        onCerrar={cerrarEditar}
        titulo="Editar marca"
      >
        {editando && item && (
          <div className="space-y-4">
            <FormularioEdicion
              item={item}
              guardando={mutationEditar.isPending}
              onGuardar={guardarEdicion}
              onCancelar={cerrarEditar}
            />
            {mutationEditar.isError && (
              <Aviso tipo="error">
                {mensajeError(
                  mutationEditar.error,
                  "No se pudo actualizar la marca. Inténtalo de nuevo.",
                )}
              </Aviso>
            )}
          </div>
        )}
      </Dialogo>

      {/* Diálogo: confirmar eliminación */}
      <Dialogo
        id="dialogo-eliminar"
        abierto={borrando && item != null}
        onCerrar={cerrarBorrar}
        titulo="Eliminar marca"
      >
        {borrando && item && (
          <div className="space-y-4">
            <p className="text-ink-muted">
              ¿Seguro que quieres eliminar la marca{" "}
              <strong className="font-semibold break-words text-ink">
                “{item.nombre}”
              </strong>
              ? Esta acción no se puede deshacer.
            </p>

            {mutationEliminar.isError && (
              <Aviso tipo="error">
                {mensajeError(
                  mutationEliminar.error,
                  "No se pudo eliminar la marca. Inténtalo de nuevo.",
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
                onClick={() => mutationEliminar.mutate(item.id)}
                disabled={mutationEliminar.isPending}
                className={botonPrimario}
              >
                {mutationEliminar.isPending ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        )}
      </Dialogo>
    </article>
  );
}
