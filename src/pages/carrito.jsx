import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearPedido } from "../services/pedido";
import { useCarritoStore } from "../stores/carrito";
import { mensajeError } from "../lib/errores";
import PaginaUsuario, { EncabezadoUsuario } from "../components/paginaUsuario";
import Aviso from "../components/aviso";
import { IconoPapelera } from "../components/iconos";
import {
  botonPrimario,
  botonSecundario,
  botonIcono,
  panel,
} from "../components/estilos";

export default function Carrito() {
  const [, navegar] = useLocation();
  const queryClient = useQueryClient();
  const { items, cambiarCantidad, quitar, vaciar } = useCarritoStore();

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  const mutacion = useMutation({
    mutationFn: () =>
      crearPedido(
        items.map(({ productoId, talleId, cantidad }) => ({
          productoId,
          talleId,
          cantidad,
        })),
      ),
    onSuccess: (respuesta) => {
      vaciar();
      // El stock cambió: se refrescan productos y pedidos.
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["producto"] });
      queryClient.invalidateQueries({ queryKey: ["mis-pedidos"] });
      navegar(
        respuesta?.datos?.id
          ? `/mis-pedidos/${respuesta.datos.id}?nuevo=1`
          : "/mis-pedidos",
      );
    },
  });

  return (
    <PaginaUsuario>
      <EncabezadoUsuario etiqueta="Tu compra" titulo="Carrito" />

      {items.length === 0 ? (
        <div className={`${panel} px-6 py-16 text-center`}>
          <p className="text-lg font-semibold text-ink">
            Tu carrito está vacío
          </p>
          <p className="mt-1 text-sm text-ink-subtle">
            Sumá productos desde el catálogo para armar tu pedido.
          </p>
          <Link href="/catalogo" className={`${botonPrimario} mt-6`}>
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <ul className={`${panel} divide-y divide-line overflow-hidden`}>
            {items.map((i) => (
              <li
                key={`${i.productoId}-${i.talleId}`}
                className="flex gap-4 p-4"
              >
                <Link
                  href={`/catalogo/${i.productoId}`}
                  className="size-20 shrink-0 overflow-hidden border border-line bg-content"
                >
                  <img
                    src={i.imagenUrl}
                    alt=""
                    onError={(e) => {
                      e.target.src = "https://placehold.co/160x160?text=?";
                    }}
                    className="size-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {i.nombre}
                      </p>
                      <p className="text-xs text-ink-subtle">
                        Talle {i.talleNombre} · $
                        {i.precio.toLocaleString("es-AR")} c/u
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitar(i.productoId, i.talleId)}
                      aria-label={`Quitar ${i.nombre} del carrito`}
                      className={botonIcono}
                    >
                      <IconoPapelera className="size-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border border-line">
                      <button
                        type="button"
                        aria-label="Restar una unidad"
                        disabled={i.cantidad <= 1}
                        onClick={() =>
                          cambiarCantidad(
                            i.productoId,
                            i.talleId,
                            i.cantidad - 1,
                          )
                        }
                        className="grid size-8 place-items-center text-ink hover:bg-hover disabled:text-ink-subtle disabled:hover:bg-transparent"
                      >
                        −
                      </button>
                      <span className="grid h-8 min-w-10 place-items-center border-x border-line text-sm font-semibold text-ink">
                        {i.cantidad}
                      </span>
                      <button
                        type="button"
                        aria-label="Sumar una unidad"
                        disabled={i.cantidad >= i.stock}
                        onClick={() =>
                          cambiarCantidad(
                            i.productoId,
                            i.talleId,
                            i.cantidad + 1,
                          )
                        }
                        className="grid size-8 place-items-center text-ink hover:bg-hover disabled:text-ink-subtle disabled:hover:bg-transparent"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-ink">
                      ${(i.precio * i.cantidad).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className={`${panel} h-fit space-y-4 p-5`}>
            <h2 className="font-semibold text-ink">Resumen</h2>
            <div className="flex items-center justify-between text-sm text-ink-muted">
              <span>{items.reduce((s, i) => s + i.cantidad, 0)} unidades</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm font-medium uppercase tracking-wider text-ink-subtle">
                Total
              </span>
              <span className="text-xl font-bold text-ink">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>

            {mutacion.isError && (
              <Aviso tipo="error" titulo="No se pudo crear el pedido">
                {mensajeError(
                  mutacion.error,
                  "Ocurrió un error inesperado. Intentá de nuevo.",
                )}
              </Aviso>
            )}

            <button
              type="button"
              onClick={() => mutacion.mutate()}
              disabled={mutacion.isPending}
              className={`${botonPrimario} w-full`}
            >
              {mutacion.isPending ? "Creando pedido…" : "Confirmar pedido"}
            </button>
            <button
              type="button"
              onClick={vaciar}
              disabled={mutacion.isPending}
              className={`${botonSecundario} w-full`}
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </PaginaUsuario>
  );
}
