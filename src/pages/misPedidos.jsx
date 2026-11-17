import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerMisPedidos } from "../services/pedido";
import PaginaUsuario, { EncabezadoUsuario } from "../components/paginaUsuario";
import EstadoPedido, { formatearFecha } from "../components/estadoPedido";
import Aviso from "../components/aviso";
import { IconoReintentar, IconoChevron } from "../components/iconos";
import { botonPrimario, botonSecundario, panel } from "../components/estilos";

export default function MisPedidos() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mis-pedidos"],
    queryFn: obtenerMisPedidos,
  });

  // Los más recientes primero.
  const pedidos = (Array.isArray(data?.datos) ? data.datos : [])
    .slice()
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <PaginaUsuario>
      <EncabezadoUsuario etiqueta="Tu historial" titulo="Mis pedidos">
        Seguí el estado de tus compras y cancelá las que sigan pendientes.
      </EncabezadoUsuario>

      {isLoading && (
        <p role="status" className="py-10 text-center text-ink-muted">
          Cargando pedidos…
        </p>
      )}

      {isError && (
        <Aviso
          tipo="error"
          titulo="No se pudieron cargar tus pedidos"
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

      {!isLoading && !isError && pedidos.length === 0 && (
        <div className={`${panel} px-6 py-16 text-center`}>
          <p className="text-lg font-semibold text-ink">
            Todavía no hiciste pedidos
          </p>
          <p className="mt-1 text-sm text-ink-subtle">
            Cuando compres algo, lo vas a ver acá.
          </p>
          <Link href="/catalogo" className={`${botonPrimario} mt-6`}>
            Ver productos
          </Link>
        </div>
      )}

      {pedidos.length > 0 && (
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {pedidos.map((p) => (
            <li key={p.id} className="bg-panel">
              <Link
                href={`/mis-pedidos/${p.id}`}
                className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-content"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
                    #{String(p.id).padStart(2, "0")} · {formatearFecha(p.fecha)}
                  </span>
                  <EstadoPedido nombre={p.estadoNombre} />
                </div>
                <ul className="space-y-1 text-sm text-ink">
                  {p.items.slice(0, 3).map((it, idx) => (
                    <li key={idx} className="truncate">
                      {it.cantidad}× {it.productoNombre}{" "}
                      <span className="text-ink-muted">({it.talleNombre})</span>
                    </li>
                  ))}
                  {p.items.length > 3 && (
                    <li className="text-xs text-ink-subtle">
                      + {p.items.length - 3} más
                    </li>
                  )}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                  <span className="font-bold text-ink">
                    ${p.total.toLocaleString("es-AR")}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-ink-subtle transition-all group-hover:gap-3 group-hover:text-ink">
                    Ver detalle <IconoChevron className="size-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PaginaUsuario>
  );
}
