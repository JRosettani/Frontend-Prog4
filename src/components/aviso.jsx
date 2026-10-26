import { IconoAlerta, IconoCheck } from "./iconos";

// Mensaje de estado (éxito, error o información). Como la paleta solo tiene
// azules, el tipo se distingue por el icono y el texto, no solo por el color.
export default function Aviso({ tipo = "info", titulo, children, accion }) {
  const Icono = tipo === "exito" ? IconoCheck : IconoAlerta;

  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className="flex gap-3 rounded-lg border border-l-4 border-line border-l-blue-light bg-content p-4"
    >
      <Icono className="mt-0.5 size-5 shrink-0 text-blue-light" />
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
