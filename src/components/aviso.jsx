import { IconoAlerta, IconoCheck } from "./iconos";

// Mensaje de estado (éxito, error o información). Al ser blanco y negro, el
// tipo se distingue por el icono, el texto y el grosor del borde, no por color.
export default function Aviso({ tipo = "info", titulo, children, accion }) {
  const Icono = tipo === "exito" ? IconoCheck : IconoAlerta;
  const borde =
    tipo === "error"
      ? "border-2 border-accent"
      : "border border-l-4 border-line border-l-accent";

  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={`flex gap-3 rounded-lg bg-content p-4 ${borde}`}
    >
      <Icono className="mt-0.5 size-5 shrink-0 text-ink" />
      <div className="min-w-0 flex-1">
        {titulo && <p className="font-medium text-ink">{titulo}</p>}
        {children && (
          <p className={`text-sm text-ink-muted ${titulo ? "mt-1" : ""}`}>
            {children}
          </p>
        )}
        {accion && <div className="mt-3">{accion}</div>}
      </div>
    </div>
  );
}
