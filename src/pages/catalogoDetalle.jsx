import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerUnoPorId } from "../services/producto";
import { useCarritoStore } from "../stores/carrito";
import PaginaUsuario from "../components/paginaUsuario";
import Aviso from "../components/aviso";
import { IconoVolver, IconoCheck } from "../components/iconos";
import { botonPrimario, botonSecundario } from "../components/estilos";

export default function CatalogoDetalle() {
  const { id } = useParams();
  const agregar = useCarritoStore((s) => s.agregar);
  const items = useCarritoStore((s) => s.items);

  const [talleId, setTalleId] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["producto", id],
    queryFn: () => obtenerUnoPorId(id),
  });

  const producto = data?.datos ?? null;
  const talles = producto?.talles ?? [];
  const talle = talles.find((t) => t.talleId === talleId) ?? null;

  // Lo que ya hay en el carrito de este talle cuenta contra el stock.
  const enCarrito =
    items.find((i) => i.productoId === producto?.id && i.talleId === talleId)
      ?.cantidad ?? 0;
  const disponible = talle ? Math.max(0, talle.stock - enCarrito) : 0;

  const elegirTalle = (t) => {
    setTalleId(t.talleId);
    setCantidad(1);
    setAgregado(false);
  };

  const handleAgregar = () => {
    if (!talle || disponible < 1) return;
    agregar({
      productoId: producto.id,
      talleId: talle.talleId,
      talleNombre: talle.talleNombre,
      nombre: producto.nombre,
      imagenUrl: producto.imagenUrl,
      precio: producto.precio,
      stock: talle.stock,
      cantidad,
    });
    setCantidad(1);
    setAgregado(true);
  };

  return (
    <PaginaUsuario>
      <Link
        href="/catalogo"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <IconoVolver className="size-4" /> Volver al catálogo
      </Link>

      {isLoading && (
        <div role="status" className="grid animate-pulse gap-10 md:grid-cols-2">
          <span className="sr-only">Cargando producto…</span>
          <div className="aspect-square bg-content" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-content" />
            <div className="h-6 w-1/4 rounded bg-content" />
            <div className="h-24 rounded bg-content" />
          </div>
        </div>
      )}

      {isError && (
        <Aviso tipo="error" titulo="No se encontró el producto">
          Puede que ya no esté disponible.
        </Aviso>
      )}

      {producto && (
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square overflow-hidden border border-line bg-content">
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              onError={(e) => {
                e.target.src = "https://placehold.co/600x600?text=?";
              }}
              className="size-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
                {producto.marcaNombre} · {producto.categoriaNombre}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                {producto.nombre}
              </h1>
              <p className="mt-3 text-2xl font-bold text-ink">
                ${producto.precio?.toLocaleString("es-AR")}
              </p>
            </div>

            {producto.descripcion && (
              <p className="leading-relaxed text-ink-muted">
                {producto.descripcion}
              </p>
            )}

            {/* Talles */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                Talle
              </p>
              {talles.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  Este producto no tiene talles cargados.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2" role="group">
                  {talles.map((t) => {
                    const sinStock = t.stock <= 0;
                    const activo = t.talleId === talleId;
                    return (
                      <button
                        key={t.talleId}
                        type="button"
                        disabled={sinStock}
                        aria-pressed={activo}
                        onClick={() => elegirTalle(t)}
                        className={`min-w-14 rounded-md border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:text-ink-subtle disabled:line-through ${
                          activo
                            ? "border-accent bg-accent text-on-accent"
                            : "border-line bg-panel text-ink hover:border-ink disabled:border-line disabled:bg-content"
                        }`}
                      >
                        {t.talleNombre}
                      </button>
                    );
                  })}
                </div>
              )}
              {talle && (
                <p className="mt-2 text-xs text-ink-subtle">
                  {talle.stock} en stock
                  {enCarrito > 0 ? ` · ${enCarrito} en tu carrito` : ""}
                </p>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                Cantidad
              </p>
              <div className="inline-flex items-center border border-line">
                <button
                  type="button"
                  aria-label="Restar una unidad"
                  disabled={!talle || cantidad <= 1}
                  onClick={() => setCantidad((c) => c - 1)}
                  className="grid size-10 place-items-center text-ink transition-colors hover:bg-hover disabled:text-ink-subtle disabled:hover:bg-transparent"
                >
                  −
                </button>
                <span
                  aria-live="polite"
                  className="grid h-10 min-w-12 place-items-center border-x border-line text-sm font-semibold text-ink"
                >
                  {cantidad}
                </span>
                <button
                  type="button"
                  aria-label="Sumar una unidad"
                  disabled={!talle || cantidad >= disponible}
                  onClick={() => setCantidad((c) => c + 1)}
                  className="grid size-10 place-items-center text-ink transition-colors hover:bg-hover disabled:text-ink-subtle disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAgregar}
                disabled={!talle || disponible < 1}
                className={`${botonPrimario} px-6`}
              >
                {!talle
                  ? "Elegí un talle"
                  : disponible < 1
                    ? "Sin más unidades"
                    : "Agregar al carrito"}
              </button>
              {agregado && (
                <Link href="/carrito" className={botonSecundario}>
                  <IconoCheck className="size-4" /> Agregado · Ver carrito
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </PaginaUsuario>
  );
}
