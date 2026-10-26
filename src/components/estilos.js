// Clases de Tailwind reutilizadas en varias pantallas.
// Todos los colores vienen de la paleta definida en App.css.

const boton =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed";

export const botonPrimario = `${boton} bg-blue text-ink hover:bg-blue-dark active:bg-blue-dark disabled:bg-content disabled:text-ink-subtle`;

export const botonSecundario = `${boton} border border-line bg-panel text-ink hover:bg-hover disabled:text-ink-subtle`;

export const panel = "rounded-lg border border-line bg-panel";

// Inicial que se muestra dentro de la ficha azul de cada categoría.
export const inicial = (nombre) =>
  String(nombre ?? "").trim().charAt(0).toUpperCase() || "?";
