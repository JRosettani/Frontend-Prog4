import { useEffect, useState } from "react";
import { Link } from "wouter";
import z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearUno, obtenerTodos, eliminarUnoPorId } from "../services/producto";
import { obtenerTodos as obtenerCategorias } from "../services/categoria";
import { obtenerTodos as obtenerMarcas } from "../services/marca";
import { obtenerTodos as obtenerTalles } from "../services/talle";
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

function EsqueletoLista() {
  return (
    <div role="status" aria-live="polite" className="p-2">
      <span className="sr-only">Cargando productos…</span>
      <ul aria-hidden="true" className="space-y-3">
        {[0, 1, 2, 3].map((n) => (
          <li
            key={n}
            className="flex items-center gap-4 p-4 rounded-xl bg-content/20 border border-line/40 backdrop-blur-sm"
          >
            <span className="size-16 shrink-0 rounded-xl bg-content motion-safe:animate-pulse shadow-inner" />
            <span className="flex-1 space-y-2">
              <span className="block h-4 w-2/5 rounded-lg bg-content motion-safe:animate-pulse" />
              <span className="block h-3.5 w-20 rounded-lg bg-content motion-safe:animate-pulse" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Productos() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["productos"],
    queryFn: obtenerTodos,
  });

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

  const items = Array.isArray(data?.datos) ? data.datos : [];
  const categorias = Array.isArray(dataCategorias?.datos)
    ? dataCategorias.datos
    : [];
  const marcas = Array.isArray(dataMarcas?.datos) ? dataMarcas.datos : [];
  const talles = Array.isArray(dataTalles?.datos) ? dataTalles.datos : [];
  const total = items.length;

  const [exito, setExito] = useState(null);
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
    control,
    formState: { errors },
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

  const mutationCrear = useMutation({
    mutationKey: ["crearProducto"],
    mutationFn: crearUno,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setExito(data?.mensaje ?? "Producto creado.");
      reset();
    },
  });

  const onSubmit = (data) => {
    setExito(null);
    mutationCrear.mutate(data);
  };

  // ---- Baja ----
  const mutationEliminar = useMutation({
    mutationKey: ["eliminarProducto"],
    mutationFn: eliminarUnoPorId,
    onSuccess: (data, id) => {
      queryClient.removeQueries({ queryKey: ["productos", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["productos"], exact: true });
      setBorrando(null);
      setExito(data?.mensaje ?? "Producto eliminado.");
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
        <h1 className="text-3xl font-bold tracking-tight text-ink bg-gradient-to-r from-ink to-ink/80 bg-clip-text">
          Productos
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Consulta, crea y elimina productos del catálogo con total fluidez.
        </p>
      </header>

      {exito && (
        <div className="mb-6 animate-fadeIn">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
        {/* Formulario de alta */}
        <aside
          aria-labelledby="titulo-nuevo"
          className={`${panel} order-1 p-6 lg:order-2 lg:sticky lg:top-24 shadow-xl backdrop-blur-md border border-line/80 relative overflow-hidden transition-all duration-300 hover:shadow-2xl`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
          <h2
            id="titulo-nuevo"
            className="text-xl font-bold tracking-tight text-ink flex items-center gap-2"
          >
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
            Nuevo producto
          </h2>
          <p className="mt-1 text-sm text-ink-subtle">
            Completá los datos y agregá al menos un talle con stock.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 space-y-5"
          >
            {/* Nombre */}
            <div className="group/field">
              <label
                htmlFor="nombre"
                className="mb-1.5 block text-sm font-semibold text-ink-muted transition-colors group-focus-within/field:text-primary"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                autoComplete="off"
                placeholder="Ej.: Traje Classic Negro"
                aria-invalid={errors.nombre ? "true" : "false"}
                className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="group/field">
              <label
                htmlFor="descripcion"
                className="mb-1.5 block text-sm font-semibold text-ink-muted transition-colors group-focus-within/field:text-primary"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                rows={3}
                placeholder="Ej.: Traje de lana italiana..."
                aria-invalid={errors.descripcion ? "true" : "false"}
                className={`${campo} resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
                {...register("descripcion")}
              />
              {errors.descripcion && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="group/field">
              <label
                htmlFor="precio"
                className="mb-1.5 block text-sm font-semibold text-ink-muted transition-colors group-focus-within/field:text-primary"
              >
                Precio
              </label>
              <input
                type="number"
                id="precio"
                min="0.01"
                step="0.01"
                placeholder="Ej.: 85000"
                aria-invalid={errors.precio ? "true" : "false"}
                className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
                {...register("precio")}
              />
              {errors.precio && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.precio.message}
                </p>
              )}
            </div>

            {/* Imagen URL */}
            <div className="group/field">
              <label
                htmlFor="imagenUrl"
                className="mb-1.5 block text-sm font-semibold text-ink-muted transition-colors group-focus-within/field:text-primary"
              >
                URL de imagen
              </label>
              <input
                type="url"
                id="imagenUrl"
                autoComplete="off"
                placeholder="https://..."
                aria-invalid={errors.imagenUrl ? "true" : "false"}
                className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
                {...register("imagenUrl")}
              />
              {errors.imagenUrl && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.imagenUrl.message}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div className="group/field">
              <label
                htmlFor="categoriaId"
                className="mb-1.5 block text-sm font-semibold text-ink-muted transition-colors group-focus-within/field:text-primary"
              >
                Categoría
              </label>
              <select
                id="categoriaId"
                aria-invalid={errors.categoriaId ? "true" : "false"}
                className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
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
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.categoriaId.message}
                </p>
              )}
            </div>

            {/* Marca */}
            <div className="group/field">
              <label
                htmlFor="marcaId"
                className="mb-1.5 block text-sm font-semibold text-ink-muted transition-colors group-focus-within/field:text-primary"
              >
                Marca
              </label>
              <select
                id="marcaId"
                aria-invalid={errors.marcaId ? "true" : "false"}
                className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
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
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.marcaId.message}
                </p>
              )}
            </div>

            {/* Talles */}
            <div className="rounded-xl border border-line/60 bg-content/20 p-4 transition-colors hover:border-line">
              <p className="mb-3 text-sm font-semibold text-ink flex items-center justify-between">
                <span>Talles y stock</span>
                <span className="text-xs font-normal text-ink-muted">
                  Inventario inicial
                </span>
              </p>
              <div className="space-y-2.5">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 items-center transition-all duration-200"
                  >
                    <select
                      aria-label={`Talle ${index + 1}`}
                      className={`${campo} flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
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
                      className={`${campo} w-24 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-ink-muted/50`}
                      {...register(`talles.${index}.stock`)}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label="Quitar talle"
                        className={`${botonIcono} text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200 hover:scale-105 active:scale-95`}
                      >
                        <IconoPapelera className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.talles && !Array.isArray(errors.talles) && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-500 animate-shake">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors.talles.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => append({ talleId: "", stock: 0 })}
                className={`${botonSecundario} mt-3 w-full border-dashed border-2 hover:border-solid hover:bg-primary/5 transition-all duration-200 active:scale-[0.99]`}
              >
                + Agregar talle
              </button>
            </div>

            <button
              type="submit"
              disabled={mutationCrear.isPending}
              className={`${botonPrimario} w-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50`}
            >
              {mutationCrear.isPending ? "Creando…" : "Crear producto"}
            </button>
          </form>

          {mutationCrear.isError && (
            <div className="mt-4 animate-fadeIn">
              <Aviso tipo="error">
                {mensajeError(
                  mutationCrear.error,
                  "No se pudo crear el producto. Inténtalo de nuevo.",
                )}
              </Aviso>
            </div>
          )}
        </aside>

        {/* Listado */}
        <section
          aria-labelledby="titulo-lista"
          aria-busy={isLoading}
          className={`${panel} order-2 overflow-hidden lg:order-1 shadow-xl backdrop-blur-md border border-line/80`}
        >
          <div className="flex items-center justify-between border-b border-line/80 px-6 py-4 bg-content/10">
            <h2 id="titulo-lista" className="font-bold text-ink text-base">
              Productos existentes
            </h2>
            {isSuccess && (
              <span className="rounded-full border border-line/80 bg-content/50 px-3 py-1 text-xs font-semibold text-ink-muted shadow-sm">
                {total} {total === 1 ? "producto" : "productos"}
              </span>
            )}
          </div>

          {isLoading && <EsqueletoLista />}

          {isError && (
            <div className="p-6">
              <Aviso
                tipo="error"
                titulo="No se pudieron cargar los productos"
                accion={
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className={`${botonSecundario} transition-all duration-200 hover:scale-[1.02] active:scale-95`}
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
            <div className="px-6 py-16 text-center">
              <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <IconoEditar className="size-6" />
              </div>
              <p className="font-semibold text-ink text-lg">
                Aún no hay productos
              </p>
              <p className="mt-1 text-sm text-ink-subtle">
                Crea el primero utilizando el formulario lateral.
              </p>
            </div>
          )}

          {isSuccess && total > 0 && (
            <ul className="divide-y divide-line/60">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group/item flex items-center gap-2 px-4 py-3 transition-all duration-200 hover:bg-content/30"
                >
                  <Link
                    href={`/productos/${item.id}`}
                    className="group flex min-w-0 flex-1 items-center gap-4 py-1 focus-visible:-outline-offset-2"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-content shadow-sm">
                      <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/64x64?text=?";
                        }}
                        className="size-16 shrink-0 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink transition-colors group-hover:text-primary">
                        {item.nombre}
                      </span>
                      <span className="inline-block mt-0.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        ${item.precio.toLocaleString("es-AR")}
                      </span>
                    </span>
                    <IconoChevron className="size-5 shrink-0 text-ink-subtle transition-all duration-200 group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>

                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/productos/${item.id}`}
                      aria-label={`Editar producto ${item.nombre}`}
                      title="Editar"
                      className={`${botonIcono} hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95`}
                    >
                      <IconoEditar className="size-4.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => abrirBorrar(item)}
                      aria-label={`Eliminar producto ${item.nombre}`}
                      title="Eliminar"
                      className={`${botonIcono} text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200 hover:scale-105 active:scale-95`}
                    >
                      <IconoPapelera className="size-4.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Diálogo: confirmar eliminación */}
      <Dialogo
        id="dialogo-eliminar"
        abierto={borrando != null}
        onCerrar={cerrarBorrar}
        titulo="Eliminar producto"
      >
        {borrando && (
          <div className="space-y-4">
            <p className="text-ink-muted">
              ¿Seguro que quieres eliminar{" "}
              <strong className="font-semibold break-words text-ink">
                "{borrando.nombre}"
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            {mutationEliminar.isError && (
              <Aviso tipo="error">
                {mensajeError(
                  mutationEliminar.error,
                  "No se pudo eliminar el producto. Inténtalo de nuevo.",
                )}
              </Aviso>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                data-autofocus
                onClick={cerrarBorrar}
                disabled={mutationEliminar.isPending}
                className={`${botonSecundario} transition-all duration-200 hover:bg-content/80 active:scale-95`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => mutationEliminar.mutate(borrando.id)}
                disabled={mutationEliminar.isPending}
                className={`${botonPrimario} bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 active:scale-95`}
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
