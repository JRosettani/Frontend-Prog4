import Footer from "./footer";

// Contenedor común de las pantallas del usuario (catálogo, carrito, pedidos).
export default function PaginaUsuario({ children }) {
  return (
    <div className="min-h-screen bg-deep">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export function EncabezadoUsuario({ etiqueta, titulo, children }) {
  return (
    <section className="relative mb-10 border-l-2 border-ink py-2 pl-6 sm:pl-10">
      <span className="absolute -left-[5px] top-0 size-2.5 bg-ink" />
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-subtle">
        {etiqueta}
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
        {titulo}
      </h1>
      {children && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          {children}
        </p>
      )}
    </section>
  );
}
