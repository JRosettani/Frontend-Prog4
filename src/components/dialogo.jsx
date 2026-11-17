import { useEffect, useRef } from "react";
import { IconoCerrar } from "./iconos";
import { botonIcono } from "./estilos";

// Ventana modal sobre el <dialog> nativo: ya trae bloqueo del fondo,
// foco atrapado y cierre con Esc. El contenido solo se monta mientras
// está abierta, así los formularios arrancan limpios cada vez.
// El elemento con data-autofocus recibe el foco al abrir.
export default function Dialogo({ abierto, onCerrar, titulo, id, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      dialogo.showModal();
      dialogo.querySelector("[data-autofocus]")?.focus();
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-titulo`}
      onClose={onCerrar}
      onClick={(e) => {
        // Un clic sobre el fondo oscuro (no sobre el contenido) cierra.
        if (e.target === ref.current) onCerrar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-ink bg-panel p-0 text-ink backdrop:bg-black/60"
    >
      {abierto && (
        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={`${id}-titulo`} className="text-lg font-semibold text-ink">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className={`${botonIcono} -mr-2 -mt-1.5`}
            >
              <IconoCerrar className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
