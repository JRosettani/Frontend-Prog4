// Etiqueta del estado de un pedido. Los estados que maneja el backend son
// Pendiente, Confirmado (u otros que cargue el admin) y Cancelado.
export default function EstadoPedido({ nombre }) {
  const estado = (nombre ?? "Pendiente").toLowerCase();
  const estilos =
    estado === "cancelado"
      ? "bg-content text-ink-subtle border-line line-through"
      : estado === "pendiente"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${estilos}`}
    >
      {nombre ?? "Pendiente"}
    </span>
  );
}

export const formatearFecha = (fecha) =>
  fecha
    ? new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Fecha no disponible";
