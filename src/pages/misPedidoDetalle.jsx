import { useState } from "react";
import { Link, useParams, useSearch } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerMiPedido, cancelarMiPedido } from "../services/pedido";
import { mensajeError } from "../lib/errores";
import PaginaUsuario from "../components/paginaUsuario";
import EstadoPedido, { formatearFecha } from "../components/estadoPedido";
import Aviso from "../components/aviso";
import Dialogo from "../components/dialogo";
import { IconoVolver } from "../components/iconos";
import { botonPrimario, botonSecundario, panel } from "../components/estilos";

export default function MisPedidoDetalle() {
  const { id } = useParams();
  const esNuevo = new URLSearchParams(useSearch()).get("nuevo") === "1";
  const queryClient = useQueryClient();
  const [confirmando, setConfirmando] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mis-pedidos", id],
    queryFn: () => obtenerMiPedido(id),
  });

  const cancelar = useMutation({
    mutationFn: () => cancelarMiPedido(id),
    onSuccess: () => {
      setConfirmando(false);
      // El stock se devolvió: se refrescan pedidos y productos.
      queryClient.invalidateQueries({ queryKey: ["mis-pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["producto"] });
    },
  });

  const pedido = data?.datos ?? null;
  const pendiente = pedido?.estadoNombre?.toLowerCase() === "pendiente";

  return (
    <PaginaUsuario>
      <Link
        href="/mis-pedidos"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <IconoVolver className="size-4" /> Volver a mis pedidos
      </Link>

      {isLoading && (
        <p role="status" className="py-10 text-center text-ink-muted">
          Cargando pedido…
        </p>
      )}

      {isError && (
        <Aviso tipo="error" titulo="No se encontró el pedido">
          Verificá que el pedido sea tuyo e intentá de nuevo.
        </Aviso>
      )}

      {pedido && (
        <div className="space-y-6">
          {esNuevo && (
            <Aviso tipo="exito" titulo="¡Pedido creado!">
              Lo recibimos y quedó pendiente de confirmación.
            </Aviso>
          )}

          <div className={`${panel} overflow-hidden`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-content/10 px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold text-ink">
                  Pedido #{String(pedido.id).padStart(2, "0")}
                </h1>
                <p className="text-xs text-ink-subtle">
                  {formatearFecha(pedido.fecha)}
                </p>
              </div>
              <EstadoPedido nombre={pedido.estadoNombre} />
            </div>

            <ul className="divide-y divide-line">
              {pedido.items.map((it, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {it.productoNombre}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      Talle {it.talleNombre} · {it.cantidad} × $
                      {it.precioUnitario.toLocaleString("es-AR")}
                    </p>
                  </div>
                  <p className="font-semibold text-ink">
                    ${(it.cantidad * it.precioUnitario).toLocaleString("es-AR")}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-line px-6 py-4">
              <span className="text-sm font-medium uppercase tracking-wider text-ink-subtle">
                Total
              </span>
              <span className="text-xl font-bold text-ink">
                ${pedido.total.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {cancelar.isError && !confirmando && (
            <Aviso tipo="error" titulo="No se pudo cancelar el pedido">
              {mensajeError(
                cancelar.error,
                "Intentá de nuevo en unos segundos.",
              )}
            </Aviso>
          )}

          {pendiente ? (
            <button
              type="button"
              onClick={() => {
                cancelar.reset();
                setConfirmando(true);
              }}
              className={botonSecundario}
            >
              Cancelar pedido
            </button>
          ) : (
            <p className="text-sm text-ink-subtle">
              Solo se pueden cancelar los pedidos pendientes.
            </p>
          )}
        </div>
      )}

      <Dialogo
        abierto={confirmando}
        onCerrar={() => setConfirmando(false)}
        titulo="¿Cancelar este pedido?"
        id="cancelar-pedido"
      >
        <p className="text-sm text-ink-muted">
          Vamos a devolver el stock de los productos. Esta acción no se puede
          deshacer.
        </p>
        {cancelar.isError && (
          <div className="mt-4">
            <Aviso tipo="error">
              {mensajeError(cancelar.error, "No se pudo cancelar el pedido.")}
            </Aviso>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            data-autofocus
            onClick={() => setConfirmando(false)}
            disabled={cancelar.isPending}
            className={botonSecundario}
          >
            Volver
          </button>
          <button
            type="button"
            onClick={() => cancelar.mutate()}
            disabled={cancelar.isPending}
            className={botonPrimario}
          >
            {cancelar.isPending ? "Cancelando…" : "Sí, cancelar"}
          </button>
        </div>
      </Dialogo>
    </PaginaUsuario>
  );
}
