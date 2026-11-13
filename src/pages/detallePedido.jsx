import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerUnoPorId, actualizarEstadoPedido } from "../services/pedido";
import Aviso from "../components/aviso";
import { IconoChevron, IconoAlerta } from "../components/iconos";
import {
  botonPrimario,
  botonSecundario,
  campo,
  panel,
} from "../components/estilos";
import { mensajeError } from "../lib/errores";

function EsqueletoDetallePedido() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      <div className="h-6 w-32 bg-content rounded-lg" />
      <div className={`${panel} p-6 space-y-6`}>
        <div className="flex justify-between items-center border-b border-line pb-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-content rounded-lg" />
            <div className="h-4 w-32 bg-content rounded-lg" />
          </div>
          <div className="h-8 w-28 bg-content rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="h-5 w-40 bg-content rounded-lg" />
          <div className="h-20 w-full bg-content rounded-xl" />
          <div className="h-20 w-full bg-content rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function DetallePedido() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [exito, setExito] = useState(null);
  const [estadoLocal, setEstadoLocal] = useState(null); // Estado local para cuando el usuario interactúa

  useEffect(() => {
    if (!exito) return;
    const t = setTimeout(() => setExito(null), 5000);
    return () => clearTimeout(t);
  }, [exito]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pedidos", id],
    queryFn: () => obtenerUnoPorId(id),
    enabled: !!id,
  });

  const pedido = data?.datos ?? data ?? null;

  const mutationActualizarEstado = useMutation({
    mutationFn: (idEstado) => actualizarEstadoPedido(id, Number(idEstado)),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", id] });
      setExito(res?.mensaje ?? "Estado del pedido actualizado correctamente.");
    },
  });

  if (isLoading) {
    return <EsqueletoDetallePedido />;
  }

  if (isError || !pedido) {
    return (
      <div className="space-y-4">
        <Link
          href="/pedidos"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <IconoChevron className="size-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />{" "}
          Volver a pedidos
        </Link>
        <Aviso
          tipo="error"
          titulo="No se pudo cargar el pedido"
          accion={
            <button
              type="button"
              onClick={() => refetch()}
              className={`${botonSecundario} transition-all duration-200 hover:scale-[1.02] active:scale-95`}
            >
              Reintentar
            </button>
          }
        >
          Comprobá tu conexión o verifica que el pedido exista.
        </Aviso>
      </div>
    );
  }

  const numeroPedido = String(pedido.id ?? id).padStart(2, "0");
  const fechaFormateada = pedido.fecha
    ? new Date(pedido.fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Fecha no disponible";

  const usuarioEmail = pedido.usuarioEmail ?? "Sin email";
  const precioTotal = pedido.total ?? pedido.precioTotal ?? 0;
  const itemsPedido = Array.isArray(pedido.items) ? pedido.items : [];

  // Obtenemos el ID del estado actual del servidor (por defecto 1 si no viene)
  const estadoServidorId = String(pedido?.idEstado ?? pedido?.estadoId ?? "1");
  const nuevoEstado = estadoLocal ?? (estadoServidorId === "2" ? "2" : "1");

  const handleCambiarEstado = (e) => {
    e.preventDefault();
    if (!nuevoEstado) return;
    setExito(null);
    mutationActualizarEstado.mutate(nuevoEstado);
  };

  const esConfirmadoVisual = nuevoEstado === "2";

  const estadoBadgeStyles = esConfirmadoVisual
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : "bg-amber-500/10 text-amber-600 border-amber-500/20";

  return (
    <>
      <header className="mb-8">
        <Link
          href="/pedidos"
          className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <IconoChevron className="size-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />{" "}
          Volver al listado de pedidos
        </Link>
      </header>

      {exito && (
        <div className="mb-6 animate-fadeIn">
          <Aviso tipo="exito">{exito}</Aviso>
        </div>
      )}

      <div
        className={`${panel} relative overflow-hidden p-6 sm:p-8 shadow-xl backdrop-blur-md border border-line/80 space-y-6`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

        {/* Cabecera del detalle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
              Administración de Orden
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Pedido #{numeroPedido}
            </h1>
            <p className="text-sm text-ink-muted">
              Registrado el {fechaFormateada}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${estadoBadgeStyles}`}
            >
              {esConfirmadoVisual ? "Confirmado" : "Pendiente"}
            </span>
          </div>
        </div>

        {/* Panel de cambio de estado (Pendiente [1] y Confirmado [2]) */}
        <div className="rounded-2xl border border-line/80 bg-content/20 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Cambiar estado del pedido
          </h2>
          <form
            onSubmit={handleCambiarEstado}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <select
              value={nuevoEstado}
              onChange={(e) => setEstadoLocal(e.target.value)}
              className={`${campo} flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20`}
            >
              <option value="1">Pendiente</option>
              <option value="2">Confirmado</option>
            </select>
            <button
              type="submit"
              disabled={mutationActualizarEstado.isPending || !nuevoEstado}
              className={`${botonPrimario} sm:w-auto transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50`}
            >
              {mutationActualizarEstado.isPending
                ? "Actualizando…"
                : "Actualizar estado"}
            </button>
          </form>

          {mutationActualizarEstado.isError && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-red-500 pt-1">
              <IconoAlerta className="size-4 shrink-0" />
              {mensajeError(
                mutationActualizarEstado.error,
                "No se pudo actualizar el estado.",
              )}
            </p>
          )}
        </div>

        {/* Información del cliente */}
        <div className="rounded-2xl border border-line/60 bg-content/10 p-5 space-y-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Cliente
          </h2>
          <span className="text-base font-semibold text-ink block">
            {usuarioEmail}
          </span>
        </div>

        {/* Listado de productos */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Productos incluidos ({itemsPedido.length})
          </h2>
          <ul className="divide-y divide-line/60 rounded-2xl border border-line/60 bg-content/10 overflow-hidden">
            {itemsPedido.map((prod, idx) => (
              <li
                key={idx}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-content/30"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-ink text-base">
                    {prod.productoNombre}
                  </p>
                  <p className="text-xs text-ink-muted flex items-center gap-3">
                    <span>
                      Talle:{" "}
                      <strong className="text-ink">{prod.talleNombre}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Cantidad:{" "}
                      <strong className="text-ink">{prod.cantidad}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Precio unitario:{" "}
                      <strong className="text-ink">
                        ${prod.precioUnitario?.toLocaleString("es-AR")}
                      </strong>
                    </span>
                  </p>
                </div>
                <div className="text-right sm:shrink-0">
                  <span className="text-sm font-bold text-ink">
                    $
                    {(prod.precioUnitario * prod.cantidad).toLocaleString(
                      "es-AR",
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Total final */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
            Monto total de la orden
          </span>
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-lg font-bold text-primary shadow-sm">
            ${precioTotal.toLocaleString("es-AR")}
          </span>
        </div>
      </div>
    </>
  );
}
