import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerTodos } from "../services/producto";
import { obtenerTodos as obtenerMarcas } from "../services/marca";
import { obtenerTodos as obtenerCategorias } from "../services/categoria";
import PaginaUsuario, { EncabezadoUsuario } from "../components/paginaUsuario";
import Aviso from "../components/aviso";
import { IconoReintentar } from "../components/iconos";
import { botonSecundario, campo } from "../components/estilos";

const lista = (data) => (Array.isArray(data?.datos) ? data.datos : []);
const stockTotal = (p) =>
  (p.talles ?? []).reduce((suma, t) => suma + (t.stock ?? 0), 0);

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [marcaId, setMarcaId] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
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

  const categorias = lista(dataCategorias);
  const marcas = lista(dataMarcas);
  const texto = busqueda.trim().toLowerCase();

  const productos = lista(data).filter(
    (p) =>
      (!texto || p.nombre?.toLowerCase().includes(texto)) &&
      (!categoriaId || String(p.categoriaId) === categoriaId) &&
      (!marcaId || String(p.marcaId) === marcaId),
  );
  const hayFiltros = busqueda || categoriaId || marcaId;

  return (
    <PaginaUsuario>
      <EncabezadoUsuario etiqueta="Colección" titulo="Productos">
        Elegí una prenda, seleccioná tu talle y sumala al carrito.
      </EncabezadoUsuario>

      {/* Filtros */}
      <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_12rem_12rem_auto]">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre…"
          aria-label="Buscar por nombre"
          className={campo}
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          aria-label="Categoría"
          className={campo}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={marcaId}
          onChange={(e) => setMarcaId(e.target.value)}
          aria-label="Marca"
          className={campo}
        >
          <option value="">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
        {hayFiltros && (
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setCategoriaId("");
              setMarcaId("");
            }}
            className={botonSecundario}
          >
            Limpiar
          </button>
        )}
      </div>

      {isError && (
        <Aviso
          tipo="error"
          titulo="No se pudieron cargar los productos"
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
      )}

      {isLoading && (
        <div
          role="status"
          className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4"
        >
          <span className="sr-only">Cargando productos…</span>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-panel">
              <div className="aspect-square bg-content" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-content" />
                <div className="h-5 w-1/3 rounded bg-content" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <p className="py-16 text-center text-ink-muted">
          {hayFiltros
            ? "Ningún producto coincide con los filtros."
            : "Todavía no hay productos disponibles."}
        </p>
      )}

      {!isLoading && !isError && productos.length > 0 && (
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => {
            const agotado = stockTotal(p) === 0;
            return (
              <Link
                key={p.id}
                href={`/catalogo/${p.id}`}
                className="group relative overflow-hidden bg-panel"
              >
                <div className="aspect-square overflow-hidden bg-content">
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x400?text=?";
                    }}
                    className={`size-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${agotado ? "opacity-50 grayscale" : ""}`}
                  />
                </div>
                {agotado && (
                  <span className="absolute left-3 top-3 bg-ink px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-widest text-on-accent">
                    Agotado
                  </span>
                )}
                <div className="space-y-1 p-4">
                  <p className="truncate text-sm font-semibold tracking-tight text-ink">
                    {p.nombre}
                  </p>
                  <p className="truncate text-xs text-ink-subtle">
                    {p.marcaNombre}
                    {p.categoriaNombre ? ` · ${p.categoriaNombre}` : ""}
                  </p>
                  <p className="text-sm font-bold text-ink">
                    ${p.precio?.toLocaleString("es-AR")}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-500 group-hover:w-full" />
              </Link>
            );
          })}
        </div>
      )}
    </PaginaUsuario>
  );
}
