import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerTodos } from "../services/producto";
import { useAuthStore } from "../stores/auth";
import Footer from "../components/footer";

const HERO_IMG =
  "https://images.unsplash.com/photo-1597859682726-d5010f58e240?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

function EsqueletoProducto() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel animate-pulse">
      <div className="aspect-square bg-content" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-content" />
        <div className="h-3 w-1/2 rounded bg-content" />
        <div className="h-5 w-1/3 rounded bg-content" />
      </div>
    </div>
  );
}

export default function HomeUsuario() {
  const usuario = useAuthStore((s) => s.usuario);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["productos"],
    queryFn: obtenerTodos,
  });

  const productos = Array.isArray(data?.datos) ? data.datos : [];
  const destacados = productos.slice(0, 8);

  return (
    <div className="min-h-screen bg-base">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-96 overflow-hidden">
        <img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        <div className="relative flex h-full flex-col items-center justify-end gap-5 px-4 pb-16 text-center sm:pb-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/50">
            Colección exclusiva
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Elegancia que <br className="hidden sm:block" />
            habla por sí sola
          </h1>
          <p className="text-sm text-white/60 tracking-wide">
            Bienvenido,{" "}
            <span className="font-semibold text-white">{usuario?.nombre}</span>
          </p>
          <Link
            href="/catalogo"
            className="mt-1 inline-flex items-center border border-white/70 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-white hover:text-black active:scale-95"
          >
            Ver colección
          </Link>
        </div>
      </section>

      {/* ── Destacados ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-ink-subtle">
              Selección
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Destacados
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-xs font-medium uppercase tracking-widest text-ink-muted transition-colors hover:text-ink"
          >
            Ver todos →
          </Link>
        </div>

        {isError && (
          <p className="py-12 text-center text-sm text-ink-muted">
            No se pudieron cargar los productos.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <EsqueletoProducto key={i} />
              ))
            : destacados.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalogo/${p.id}`}
                  className="group overflow-hidden rounded-none border border-line bg-panel transition-all hover:border-ink hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden bg-content">
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x400?text=?";
                      }}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 p-4">
                    <p className="truncate text-sm font-semibold tracking-tight text-ink">
                      {p.nombre}
                    </p>
                    <p className="truncate text-xs text-ink-subtle">
                      {p.descripcion}
                    </p>
                    <p className="text-sm font-bold text-ink">
                      ${p.precio?.toLocaleString("es-AR")}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* ── Historia ─────────────────────────────────────────── */}
      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-ink-subtle">
                Nuestra historia
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                Más de una década <br /> vistiendo la elegancia
              </h2>
              <p className="leading-relaxed text-ink-muted">
                Fundada con la convicción de que la ropa formal no es un lujo,
                sino una declaración de carácter, nuestra tienda nació para
                ofrecer prendas de alta confección a quienes entienden que el
                estilo es atemporal.
              </p>
              <p className="leading-relaxed text-ink-muted">
                Cada pieza es seleccionada con criterio: cortes precisos, telas
                nobles y una atención al detalle que solo se aprecia al
                vestirla. No seguimos tendencias — las trascendemos.
              </p>
              <Link
                href="/catalogo"
                className="inline-flex items-center border border-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-all hover:bg-ink hover:text-panel active:scale-95"
              >
                Explorar catálogo
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { numero: "10+", label: "Años de trayectoria" },
                { numero: "500+", label: "Prendas en catálogo" },
                { numero: "100%", label: "Confección cuidada" },
                { numero: "∞", label: "Estilo atemporal" },
              ].map(({ numero, label }) => (
                <div key={label} className="border border-line p-6 text-center">
                  <p className="text-3xl font-bold tracking-tight text-ink">
                    {numero}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-ink-subtle">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
