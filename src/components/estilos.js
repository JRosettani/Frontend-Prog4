// Clases de Tailwind reutilizadas en varias pantallas.
// Todos los colores vienen de la paleta blanco/negro definida en App.css.

const boton =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed";

export const botonPrimario = `${boton} bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-hover disabled:bg-content disabled:text-ink-subtle`;

export const botonSecundario = `${boton} border border-ink bg-panel text-ink hover:bg-hover disabled:border-line disabled:text-ink-subtle`;

// Botón cuadrado con solo un icono (siempre con aria-label).
export const botonIcono =
  "grid size-9 shrink-0 place-items-center rounded-md border border-transparent text-ink-muted transition-colors hover:border-ink hover:bg-panel hover:text-ink";

export const campo =
  "block w-full rounded-md border border-line bg-deep px-3 py-2.5 text-ink placeholder:text-ink-subtle hover:border-ink-subtle focus:border-accent aria-invalid:border-2 aria-invalid:border-accent";

export const panel = "rounded-lg border border-line bg-panel";

// Inicial que se muestra dentro de la ficha negra de cada registro.
export const inicial = (nombre) =>
  String(nombre ?? "")
    .trim()
    .charAt(0)
    .toUpperCase() || "?";
