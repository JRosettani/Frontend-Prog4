import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  obtenerUnoPorId,
  actualizarUnoPorId,
  eliminarUnoPorId,
} from "../services/producto";
import { obtenerTodos as obtenerCategorias } from "../services/categoria";
import { obtenerTodos as obtenerMarcas } from "../services/marca";
import { obtenerTodos as obtenerTalles } from "../services/talle";
import Aviso from "../components/aviso";
import Dialogo from "../components/dialogo";
import { IconoAlerta, IconoChevron, IconoPapelera } from "../components/iconos";
import {
  botonIcono,
  botonPrimario,
  botonSecundario,
  campo,
  panel,
} from "../components/estilos";
import { mensajeError } from "../lib/errores";

const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  descripcion: z.string().trim().min(2, "Mínimo 2 caracteres"),
  precio: z.coerce
    .number({ invalid_type_error: "Ingresá un precio válido" })
    .positive("El precio debe ser mayor a 0"),
  imagenUrl: z.string().trim().url("Ingresá una URL válida"),
  categoriaId: z.coerce
    .number({ invalid_type_error: "Elegí una categoría" })
    .positive("Elegí una categoría"),
  marcaId: z.coerce
    .number({ invalid_type_error: "Elegí una marca" })
    .positive("Elegí una marca"),
  talles: z
    .array(
      z.object({
        talleId: z.coerce
          .number({ invalid_type_error: "Elegí un talle" })
          .positive("Elegí un talle"),
        stock: z.coerce
          .number({ invalid_type_error: "Ingresá un stock válido" })
          .int()
          .min(0, "El stock no puede ser negativo"),
      }),
    )
    .min(1, "Agregá al menos un talle"),
});

export default function Producto() {
  const { id } = useParams();
  const [, navegar] = useLocation();
  const queryClient = useQueryClient();

  const [exito, setExito] = useState(null);
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false);

  useEffect(() => {
    if (!exito) return;
    const t = setTimeout(() => setExito(null), 5000);
    return () => clearTimeout(t);
  }, [exito]);

  // ---- Selects ----
  const { data: dataCategorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: obtenerCategorias,
  });
  const { data: dataMarcas } = useQuery({
    queryKey: ["marcas"],
    queryFn: obtenerMarcas,
  });
  const { data: dataTalles } = useQuery({
    queryKey: ["talles"],
    queryFn: obtenerTalles,
  });

  const categorias = Array.isArray(dataCategorias?.datos)
    ? dataCategorias.datos
    : [];
  const marcas = Array.isArray(dataMarcas?.datos) ? dataMarcas.datos : [];
  const talles = Array.isArray(dataTalles?.datos) ? dataTalles.datos : [];

  // ---- Carga del producto ----
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["productos", id],
    queryFn: () => obtenerUnoPorId(id),
    enabled: !!id,
  });

  const producto = data?.datos ?? null;

  // ---- Formulario ----
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      imagenUrl: "",
      categoriaId: "",
      marcaId: "",
      talles: [{ talleId: "", stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "talles" });

  // Cuando llega el producto, pre-carga el formulario
  useEffect(() => {
    if (!producto) return;
    reset({
      nombre: producto.nombre ?? "",
      descripcion: producto.descripcion ?? "",
      precio: producto.precio ?? "",
      imagenUrl: producto.imagenUrl ?? "",
      categoriaId: producto.categoriaId ?? "",
      marcaId: producto.marcaId ?? "",
      // Si el producto trae talles los mapea, si no pone uno vacío
      talles: producto.talles?.length
        ? producto.talles.map((t) => ({
            talleId: t.talleId ?? t.id,
            stock: t.stock ?? 0,
          }))
        : [{ talleId: "", stock: 0 }],
    });
  }, [producto, reset]);

  // ---- Actualizar ----
  const mutationActualizar = useMutation({
    mutationKey: ["actualizarProducto", id],
    mutationFn: (datos) => actualizarUnoPorId(id, datos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setExito(data?.mensaje ?? "Producto actualizado.");
      reset(undefined, { keepValues: true }); // limpia isDirty sin cambiar valores
    },
  });

  const onSubmit = (data) => {
    setExito(null);
    mutationActualizar.mutate(data);
  };

  // ---- Eliminar ----
  const mutationEliminar = useMutation({
    mutationKey: ["eliminarProducto", id],
    mutationFn: () => eliminarUnoPorId(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["productos", id] });
      queryClient.invalidateQueries({ queryKey: ["productos"], exact: true });
      navegar("/productos");
    },
  });

  // ---- Estados de carga / error ----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <EsqueletoCabecera />
        <EsqueletoFormulario />
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="space-y-4">
        <Link
          href="/productos"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <IconoChevron className="size-4 rotate-180" /> Volver a productos
        </Link>
        <Aviso
          tipo="error"
          titulo="No se pudo cargar el producto"
          accion={
            <button
              type="button"
              onClick={() => refetch()}
              className={botonSecundario}
            >
              Reintentar
            </button>
          }
        >
          Comprobá tu conexión e intentalo de nuevo.
        </Aviso>
      </div>
    );
  }

  return (
    <>
      {/* Cabecera */}
      <header className="mb-8">
        <Link
          href="/productos"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <IconoChevron className="size-4 rotate-180" /> Volver a productos
        </Link>
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = "https://placehold.co/200x200?text=?";
            }}
            className="size-48 rounded-xl object-cover bg-content shadow-md"
          />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              {producto.nombre}
            </h1>
            <p className="mt-1 text-ink-muted">
              ${producto.precio?.toLocaleString("es-AR")}
            </p>
          </div>
        </div>
      </header>

      {exito && (
        <div className="mb-6">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      {/* Formulario de edición */}
      <div className={`${panel} p-5`}>
        <h2 className="mb-5 text-lg font-semibold text-ink">Editar producto</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Nombre */}
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

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="mb-1.5 block text-sm font-medium text-ink-muted"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={3}
              aria-invalid={errors.descripcion ? "true" : "false"}
              className={`${campo} resize-none`}
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label
              htmlFor="precio"
              className="mb-1.5 block text-sm font-medium text-ink-muted"
            >
              Precio
            </label>
            <input
              type="number"
              id="precio"
              min="0.01"
              step="0.01"
              aria-invalid={errors.precio ? "true" : "false"}
              className={campo}
              {...register("precio")}
            />
            {errors.precio && (
              <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                {errors.precio.message}
              </p>
            )}
          </div>

          {/* Imagen URL */}
          <div>
            <label
              htmlFor="imagenUrl"
              className="mb-1.5 block text-sm font-medium text-ink-muted"
            >
              URL de imagen
            </label>
            <input
              type="url"
              id="imagenUrl"
              autoComplete="off"
              aria-invalid={errors.imagenUrl ? "true" : "false"}
              className={campo}
              {...register("imagenUrl")}
            />
            {errors.imagenUrl && (
              <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                {errors.imagenUrl.message}
              </p>
            )}
          </div>

          {/* Categoría + Marca en fila */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="categoriaId"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                Categoría
              </label>
              <select
                id="categoriaId"
                aria-invalid={errors.categoriaId ? "true" : "false"}
                className={campo}
                {...register("categoriaId")}
              >
                <option value="">Seleccioná una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.categoriaId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="marcaId"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                Marca
              </label>
              <select
                id="marcaId"
                aria-invalid={errors.marcaId ? "true" : "false"}
                className={campo}
                {...register("marcaId")}
              >
                <option value="">Seleccioná una marca</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
              {errors.marcaId && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.marcaId.message}
                </p>
              )}
            </div>
          </div>

          {/* Talles */}
          <div>
            <p className="mb-2 text-sm font-medium text-ink-muted">
              Talles y stock
            </p>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <select
                    aria-label={`Talle ${index + 1}`}
                    className={`${campo} flex-1`}
                    {...register(`talles.${index}.talleId`)}
                  >
                    <option value="">Talle</option>
                    {talles.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    aria-label={`Stock talle ${index + 1}`}
                    className={`${campo} w-24`}
                    {...register(`talles.${index}.stock`)}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label="Quitar talle"
                      className={botonIcono}
                    >
                      <IconoPapelera className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.talles && !Array.isArray(errors.talles) && (
              <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                {errors.talles.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => append({ talleId: "", stock: 0 })}
              className={`${botonSecundario} mt-2 w-full`}
            >
              + Agregar talle
            </button>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => {
                setConfirmandoBorrar(true);
                mutationEliminar.reset();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-red-500 transition-all hover:border-red-300 hover:bg-red-50 active:scale-95 dark:hover:bg-red-950/40"
            >
              <IconoPapelera className="size-4" /> Eliminar producto
            </button>

            <button
              type="submit"
              disabled={mutationActualizar.isPending}
              className={`${botonPrimario} min-w-32`}
            >
              {mutationActualizar.isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>

        {mutationActualizar.isError && (
          <div className="mt-4">
            <Aviso tipo="error">
              {mensajeError(
                mutationActualizar.error,
                "No se pudo actualizar el producto.",
              )}
            </Aviso>
          </div>
        )}
      </div>

      {/* Diálogo confirmar eliminación */}
      <Dialogo
        id="dialogo-eliminar-producto"
        abierto={confirmandoBorrar}
        onCerrar={() => setConfirmandoBorrar(false)}
        titulo="Eliminar producto"
      >
        <div className="space-y-4">
          <p className="text-ink-muted">
            ¿Seguro que querés eliminar{" "}
            <strong className="font-semibold text-ink">
              "{producto.nombre}"
            </strong>
            ? Esta acción no se puede deshacer.
          </p>
          {mutationEliminar.isError && (
            <Aviso tipo="error">
              {mensajeError(
                mutationEliminar.error,
                "No se pudo eliminar el producto.",
              )}
            </Aviso>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              data-autofocus
              onClick={() => setConfirmandoBorrar(false)}
              disabled={mutationEliminar.isPending}
              className={botonSecundario}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => mutationEliminar.mutate()}
              disabled={mutationEliminar.isPending}
              className={botonPrimario}
            >
              {mutationEliminar.isPending ? "Eliminando…" : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </Dialogo>
    </>
  );
}

// ---- Esqueletos ----
function EsqueletoCabecera() {
  return (
    <div className="mb-8 flex items-start gap-4" aria-hidden="true">
      <span className="size-16 shrink-0 rounded-lg bg-content motion-safe:animate-pulse" />
      <div className="space-y-2 pt-1">
        <span className="block h-7 w-48 rounded bg-content motion-safe:animate-pulse" />
        <span className="block h-4 w-24 rounded bg-content motion-safe:animate-pulse" />
      </div>
    </div>
  );
}

function EsqueletoFormulario() {
  return (
    <div
      className="rounded-xl border border-line bg-panel p-5 space-y-4"
      aria-hidden="true"
    >
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="space-y-1.5">
          <span className="block h-3.5 w-20 rounded bg-content motion-safe:animate-pulse" />
          <span className="block h-9 w-full rounded-lg bg-content motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}
