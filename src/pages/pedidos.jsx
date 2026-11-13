import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerTodos as obtenerPedidos } from "../services/pedido";
import Aviso from "../components/aviso";
import { IconoReintentar, IconoChevron } from "../components/iconos";
import { botonSecundario, panel } from "../components/estilos";

function EsqueletoListaPedidos() {
  return (
    <div role="status" aria-live="polite" className="p-4">
      <span className="sr-only">Cargando pedidos…</span>
      <ul
        aria-hidden="true"
        className="grid gap-px border border-line bg-line sm:grid-cols-2"
      >
        {[0, 1, 2, 3].map((n) => (
          <li key={n} className="bg-panel p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="block h-5 w-28 rounded bg-content motion-safe:animate-pulse" />
              <span className="block h-6 w-20 rounded-full bg-content motion-safe:animate-pulse" />
            </div>
            <span className="block h-4 w-3/4 rounded bg-content motion-safe:animate-pulse" />
            <span className="block h-16 w-full rounded bg-content motion-safe:animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Pedidos() {
  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["pedidos"],
    queryFn: obtenerPedidos,
  });

  const items = Array.isArray(data?.datos)
    ? data.datos
    : Array.isArray(data)
      ? data
      : [];
  const total = items.length;

  return (
    <>
      {/* Sección Hero */}
      <section className="relative border-l-2 border-ink py-2 pl-6 sm:py-6 sm:pl-10 mb-10">
        <span className="absolute -left-[5px] top-0 size-2.5 bg-ink" />

        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-subtle">
          Gestión de transacciones
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Pedidos
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
          Monitorea los pedidos en tiempo real, revisa los datos de los clientes
          y el detalle de los productos comprados.
        </p>

        <span className="mt-8 block h-px w-16 bg-ink" />
      </section>

      {/* Contenedor Principal */}
      <div className={`${panel} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-content/10">
          <h2 className="font-semibold text-ink">Historial general</h2>
          {isSuccess && (
            <span className="rounded-full border border-line bg-content px-3 py-0.5 text-sm font-semibold text-ink-muted">
              {total} {total === 1 ? "pedido" : "pedidos"}
            </span>
          )}
        </div>

        {isLoading && <EsqueletoListaPedidos />}

        {isError && (
          <div className="p-6">
            <Aviso
              tipo="error"
              titulo="No se pudieron cargar los pedidos"
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
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-ink text-lg">Aún no hay pedidos</p>
            <p className="mt-1 text-sm text-ink-subtle">
              Los nuevos pedidos de los clientes aparecerán listados aquí.
            </p>
          </div>
        )}

        {isSuccess && total > 0 && (
          <ul className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
            {items.map((item, index) => {
              const numeroPedido = String(item.id ?? index + 1).padStart(
                2,
                "0",
              );
              const fechaFormateada = item.fecha
                ? new Date(item.fecha).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Fecha no disponible";

              const usuarioEmail = item.usuarioEmail ?? "Sin email";
              const estadoNombre =
                item.estadoNombre ?? item.estado ?? "Pendiente";
              const estadoId = String(item.idEstado ?? item.estadoId ?? "1");
              const precioTotal = item.total ?? item.precioTotal ?? 0;
              const itemsPedido = Array.isArray(item.items) ? item.items : [];

              // Validación para identificar si está confirmado (ID 2 o texto)
              const esConfirmado =
                estadoId === "2" || estadoNombre.toLowerCase() === "confirmado";

              const estadoBadgeStyles = esConfirmado
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20";

              return (
                <li key={item.id ?? index} className="bg-panel">
                  <Link
                    href={`/pedidos/${item.id}`}
                    className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden p-6 transition-colors duration-200 hover:bg-content block"
                  >
                    {/* Número decorativo de fondo */}
                    <span
                      aria-hidden="true"
                      className="absolute -right-3 -top-4 text-7xl font-black text-ink/5 select-none transition-all duration-300 group-hover:text-ink/10 group-hover:-top-2"
                    >
                      {numeroPedido}
                    </span>

                    <div className="space-y-4">
                      {/* Cabecera de la tarjeta */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
                          #{numeroPedido} • {fechaFormateada}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${estadoBadgeStyles}`}
                        >
                          {esConfirmado ? "Confirmado" : "Pendiente"}
                        </span>
                      </div>

                      {/* Datos del usuario */}
                      <div>
                        <span className="block text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                          {usuarioEmail}
                        </span>
                        <span className="text-xs text-ink-subtle">
                          Cliente registrado
                        </span>
                      </div>

                      {/* Detalle resumido de los productos */}
                      <div className="rounded-xl border border-line bg-panel/50 p-3 space-y-2 pointer-events-none">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                          Productos ({itemsPedido.length})
                        </p>
                        <ul className="divide-y divide-line/60 text-sm">
                          {itemsPedido.map((prod, pIdx) => (
                            <li
                              key={pIdx}
                              className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
                            >
                              <p className="font-medium text-ink truncate">
                                {prod.cantidad}x {prod.productoNombre} (
                                {prod.talleNombre})
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Monto Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-line/60">
                        <span className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
                          Total final
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                          ${precioTotal.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-ink-subtle transition-all duration-200 group-hover:gap-3 group-hover:text-ink">
                      Ver detalle completo
                      <IconoChevron className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>

                    {/* Línea inferior animada al hacer hover */}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
