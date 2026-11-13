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
  nombre: z.string().trim().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  descripcion: z.string().trim().min(2, "Mínimo 2 caracteres"),
  precio: z.coerce.number({ invalid_type_error: "Ingresá un precio válido" }).positive("El precio debe ser mayor a 0"),
  imagenUrl: z.string().trim().url("Ingresá una URL válida"),
  categoriaId: z.coerce.number({ invalid_type_error: "Elegí una categoría" }).positive("Elegí una categoría"),
  marcaId: z.coerce.number({ invalid_type_error: "Elegí una marca" }).positive("Elegí una marca"),
  talles: z.array(
    z.object({
      talleId: z.coerce.number({ invalid_type_error: "Elegí un talle" }).positive("Elegí un talle"),
      stock: z.coerce.number({ invalid_type_error: "Ingresá un stock válido" }).int().min(0, "El stock no puede ser negativo"),
    })
  ).min(1, "Agregá al menos un talle"),
});

function EsqueletoLista() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando productos…</span>
      <ul aria-hidden="true" className="divide-y divide-line">
        {[0, 1, 2, 3].map((n) => (
          <li key={n} className="flex items-center gap-4 px-4 py-4">
            <span className="size-16 shrink-0 rounded-lg bg-content motion-safe:animate-pulse" />
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
  const categorias = Array.isArray(dataCategorias?.datos) ? dataCategorias.datos : [];
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
  const { handleSubmit, register, reset, control, formState: { errors } } = useForm({
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
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Productos</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Consulta, crea y elimina productos del catálogo.
        </p>
      </header>

      {exito && (
        <div className="mb-6">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">

        {/* Formulario de alta */}
        <aside aria-labelledby="titulo-nuevo" className={`${panel} order-1 p-5 lg:order-2 lg:sticky lg:top-24`}>
          <h2 id="titulo-nuevo" className="text-lg font-semibold text-ink">Nuevo producto</h2>
          <p className="mt-1 text-sm text-ink-subtle">
            Completá los datos y agregá al menos un talle con stock.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-ink-muted">Nombre</label>
              <input type="text" id="nombre" autoComplete="off" placeholder="Ej.: Traje Classic Negro"
                aria-invalid={errors.nombre ? "true" : "false"} className={campo} {...register("nombre")} />
              {errors.nombre && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.nombre.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="mb-1.5 block text-sm font-medium text-ink-muted">Descripción</label>
              <textarea id="descripcion" rows={3} placeholder="Ej.: Traje de lana italiana..."
                aria-invalid={errors.descripcion ? "true" : "false"}
                className={`${campo} resize-none`} {...register("descripcion")} />
              {errors.descripcion && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.descripcion.message}
                </p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="precio" className="mb-1.5 block text-sm font-medium text-ink-muted">Precio</label>
              <input type="number" id="precio" min="0.01" step="0.01" placeholder="Ej.: 85000"
                aria-invalid={errors.precio ? "true" : "false"} className={campo} {...register("precio")} />
              {errors.precio && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.precio.message}
                </p>
              )}
            </div>

            {/* Imagen URL */}
            <div>
              <label htmlFor="imagenUrl" className="mb-1.5 block text-sm font-medium text-ink-muted">URL de imagen</label>
              <input type="url" id="imagenUrl" autoComplete="off" placeholder="https://..."
                aria-invalid={errors.imagenUrl ? "true" : "false"} className={campo} {...register("imagenUrl")} />
              {errors.imagenUrl && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.imagenUrl.message}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoriaId" className="mb-1.5 block text-sm font-medium text-ink-muted">Categoría</label>
              <select id="categoriaId" aria-invalid={errors.categoriaId ? "true" : "false"}
                className={campo} {...register("categoriaId")}>
                <option value="">Seleccioná una categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              {errors.categoriaId && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.categoriaId.message}
                </p>
              )}
            </div>

            {/* Marca */}
            <div>
              <label htmlFor="marcaId" className="mb-1.5 block text-sm font-medium text-ink-muted">Marca</label>
              <select id="marcaId" aria-invalid={errors.marcaId ? "true" : "false"}
                className={campo} {...register("marcaId")}>
                <option value="">Seleccioná una marca</option>
                {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
              {errors.marcaId && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.marcaId.message}
                </p>
              )}
            </div>

            {/* Talles */}
            <div>
              <p className="mb-2 text-sm font-medium text-ink-muted">Talles y stock</p>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <select aria-label={`Talle ${index + 1}`} className={`${campo} flex-1`}
                      {...register(`talles.${index}.talleId`)}>
                      <option value="">Talle</option>
                      {talles.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                    <input type="number" min="0" placeholder="Stock"
                      aria-label={`Stock talle ${index + 1}`}
                      className={`${campo} w-24`} {...register(`talles.${index}.stock`)} />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)}
                        aria-label="Quitar talle" className={botonIcono}>
                        <IconoPapelera className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.talles && !Array.isArray(errors.talles) && (
                <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />{errors.talles.message}
                </p>
              )}
              <button type="button" onClick={() => append({ talleId: "", stock: 0 })}
                className={`${botonSecundario} mt-2 w-full`}>
                + Agregar talle
              </button>
            </div>

            <button type="submit" disabled={mutationCrear.isPending} className={`${botonPrimario} w-full`}>
              {mutationCrear.isPending ? "Creando…" : "Crear producto"}
            </button>
          </form>

          {mutationCrear.isError && (
            <div className="mt-4">
              <Aviso tipo="error">
                {mensajeError(mutationCrear.error, "No se pudo crear el producto. Inténtalo de nuevo.")}
              </Aviso>
            </div>
          )}
        </aside>

        {/* Listado */}
        <section aria-labelledby="titulo-lista" aria-busy={isLoading}
          className={`${panel} order-2 overflow-hidden lg:order-1`}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id="titulo-lista" className="font-semibold text-ink">Productos existentes</h2>
            {isSuccess && (
              <span className="rounded-full border border-line bg-content px-2.5 py-0.5 text-sm text-ink-muted">
                {total}
              </span>
            )}
          </div>

          {isLoading && <EsqueletoLista />}

          {isError && (
            <div className="p-4">
              <Aviso tipo="error" titulo="No se pudieron cargar los productos"
                accion={
                  <button type="button" onClick={() => refetch()} className={botonSecundario}>
                    <IconoReintentar className="size-4" /> Reintentar
                  </button>
                }>
                Comprueba tu conexión con el servidor e inténtalo de nuevo.
              </Aviso>
            </div>
          )}

          {isSuccess && total === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-ink">Aún no hay productos</p>
              <p className="mt-1 text-sm text-ink-subtle">Crea el primero con el formulario.</p>
            </div>
          )}

          {isSuccess && total > 0 && (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-1 pr-2 transition-colors hover:bg-hover">
                  <Link href={`/productos/${item.id}`}
                    className="group flex min-w-0 flex-1 items-center gap-4 px-4 py-4 focus-visible:-outline-offset-2">
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
                      onError={(e) => { e.target.src = "https://placehold.co/64x64?text=?"; }}
                      className="size-16 shrink-0 rounded-lg object-cover bg-content shadow-sm transition-transform group-hover:scale-105"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{item.nombre}</span>
                      <span className="block text-sm text-ink-subtle">
                        ${item.precio.toLocaleString("es-AR")}
                      </span>
                    </span>
                    <IconoChevron className="size-5 shrink-0 text-ink-subtle transition-colors group-hover:text-ink" />
                  </Link>

                  <Link href={`/productos/${item.id}`}
                    aria-label={`Editar producto ${item.nombre}`} title="Editar"
                    className={botonIcono}>
                    <IconoEditar className="size-4.5" />
                  </Link>

                  <button type="button" onClick={() => abrirBorrar(item)}
                    aria-label={`Eliminar producto ${item.nombre}`} title="Eliminar"
                    className={botonIcono}>
                    <IconoPapelera className="size-4.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Diálogo: confirmar eliminación */}
      <Dialogo id="dialogo-eliminar" abierto={borrando != null} onCerrar={cerrarBorrar} titulo="Eliminar producto">
        {borrando && (
          <div className="space-y-4">
            <p className="text-ink-muted">
              ¿Seguro que quieres eliminar{" "}
              <strong className="font-semibold break-words text-ink">"{borrando.nombre}"</strong>?
              Esta acción no se puede deshacer.
            </p>
            {mutationEliminar.isError && (
              <Aviso tipo="error">
                {mensajeError(mutationEliminar.error, "No se pudo eliminar el producto. Inténtalo de nuevo.")}
              </Aviso>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" data-autofocus onClick={cerrarBorrar}
                disabled={mutationEliminar.isPending} className={botonSecundario}>
                Cancelar
              </button>
              <button type="button" onClick={() => mutationEliminar.mutate(borrando.id)}
                disabled={mutationEliminar.isPending} className={botonPrimario}>
                {mutationEliminar.isPending ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        )}
      </Dialogo>
    </>
  );
}