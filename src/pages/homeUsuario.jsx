import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { obtenerTodos } from "../services/producto";
import { obtenerTodos as obtenerMarcas } from "../services/marca";
import { useAuthStore } from "../stores/auth";
import Footer from "../components/footer";

const HERO_IMG =
  "https://images.unsplash.com/photo-1597859682726-d5010f58e240?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const MARQUEE_TEXTOS = [
  "Nueva temporada",
  "Alta confección",
  "Colección exclusiva",
  "Estilo atemporal",
  "Prendas seleccionadas",
  "Calidad garantizada",
];

function EsqueletoProducto() {
  return (
    <div className="overflow-hidden border border-line bg-panel animate-pulse">
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

  const { data: dataMarcas } = useQuery({
    queryKey: ["marcas"],
    queryFn: obtenerMarcas,
  });

  const productos = Array.isArray(data?.datos) ? data.datos : [];
  const destacados = productos.slice(0, 8);
  const marcas = Array.isArray(dataMarcas?.datos) ? dataMarcas.datos : [];

  return (
    <div className="min-h-screen bg-deep">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[88vh] min-h-96 overflow-hidden">
        <img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-top transition-transform duration-[12000ms] ease-out scale-[1.08] hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Líneas laterales */}
        <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <span className="[writing-mode:vertical-rl] text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-white/25">
            Nueva temporada
          </span>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <span className="[writing-mode:vertical-rl] rotate-180 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-white/25">
            Alta confección
          </span>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>

        {/* Esquinas decorativas */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-4 size-6 border-l border-t border-white/20 sm:left-8 sm:top-8"
        />
        <div
          aria-hidden="true"
          className="absolute right-4 top-4 size-6 border-r border-t border-white/20 sm:right-8 sm:top-8"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-4 size-6 border-b border-l border-white/20 sm:bottom-8 sm:left-8"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-4 right-4 size-6 border-b border-r border-white/20 sm:bottom-8 sm:right-8"
        />

        {/* Contenido */}
        <div className="relative flex h-full flex-col items-center justify-end gap-6 px-4 pb-20 text-center sm:pb-32">
          {/* Label animado */}
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.6em] text-white/35"
            style={{ animation: "fadeUp 0.8s ease both" }}
          >
            Colección exclusiva · {new Date().getFullYear()}
          </p>

          {/* Título con cada línea animada por separado */}
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
            <span
              className="block overflow-hidden"
              style={{
                animation: "slideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s both",
              }}
            >
              Porque hay ropa,
            </span>
            <span
              className="relative block overflow-hidden italic"
              style={{
                animation: "slideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.25s both",
              }}
            >
              {/* Línea decorativa que cruza */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 hidden h-px w-0 -translate-x-1/2 -translate-y-1/2 bg-white/20 sm:block"
                style={{ animation: "expandLine 1.2s ease 1.2s both" }}
              />
              y hay prendas
            </span>
            <span
              className="block overflow-hidden"
              style={{
                animation: "slideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.4s both",
              }}
            >
              — que te definen.
            </span>
          </h1>

          {/* Separador animado */}
          <div
            className="flex items-center gap-4"
            style={{ animation: "fadeUp 0.8s ease 0.6s both" }}
          >
            <span
              className="h-px w-0 bg-white/20"
              style={{ animation: "expandLine 0.8s ease 0.8s both" }}
            />
            <p className="text-[0.6rem] tracking-[0.4em] text-white/40 uppercase">
              Bienvenido,{" "}
              <span className="font-semibold text-white/70">
                {usuario?.nombre}
              </span>
            </p>
            <span
              className="h-px w-0 bg-white/20"
              style={{ animation: "expandLine 0.8s ease 0.8s both" }}
            />
          </div>

          {/* CTA */}
          <div style={{ animation: "fadeUp 0.8s ease 0.8s both" }}>
            <Link
              href="/catalogo"
              className="group relative inline-flex items-center gap-3 overflow-hidden border border-white/40 px-10 py-3.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] active:scale-[0.98]"
            >
              <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-black">
                Ver colección
              </span>
              <span className="relative transition-all duration-300 group-hover:text-black group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ animation: "fadeUp 1s ease 1.2s both" }}
        >
          <div className="h-10 w-px overflow-hidden bg-white/10">
            <div className="h-full w-full animate-bounce bg-gradient-to-b from-transparent via-white/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-line bg-ink py-3.5">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {MARQUEE_TEXTOS.map((texto) => (
                <span key={texto} className="flex items-center gap-6 px-6">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-on-accent">
                    {texto}
                  </span>
                  <span className="text-on-accent/25 text-xs">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Destacados ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 flex items-end justify-between border-b border-line pb-6">
          <div>
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-ink-subtle">
              Selección curada
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
              Destacados
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="group flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink"
          >
            <span className="relative">
              Ver todos
              <span className="absolute -bottom-px left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

        {isError && (
          <p className="py-16 text-center text-sm text-ink-muted">
            No se pudieron cargar los productos.
          </p>
        )}

        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <EsqueletoProducto key={i} />
              ))
            : destacados.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalogo/${p.id}`}
                  className="group relative overflow-hidden bg-panel"
                >
                  <div className="absolute inset-0 z-10 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                  <div className="aspect-square overflow-hidden bg-content">
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x400?text=?";
                      }}
                      className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.07]"
                    />
                  </div>
                  {p.categoriaNombre && (
                    <span className="absolute left-3 top-3 z-20 bg-panel/90 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-widest text-ink-subtle backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
                      {p.categoriaNombre}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full bg-ink px-4 py-3 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-on-accent">
                      Ver producto →
                    </span>
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
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
        </div>
      </section>

      {/* ── Marcas ───────────────────────────────────────────── */}
      {marcas.length > 0 && (
        <section className="border-t border-line bg-content/30">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="mb-12 text-center text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-ink-subtle">
              Nuestras marcas
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {marcas.map((m) => (
                <span
                  key={m.id}
                  className="group relative cursor-default select-none text-xl font-bold uppercase tracking-[0.2em] text-ink-subtle/30 transition-all duration-300 hover:text-ink"
                >
                  {m.nombre}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Historia ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line bg-panel">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-content/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute left-4 top-4 size-5 border-l border-t border-line sm:left-8 sm:top-8"
        />
        <div
          aria-hidden="true"
          className="absolute right-4 top-4 size-5 border-r border-t border-line sm:right-8 sm:top-8"
        />

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-ink-subtle" />
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-ink-subtle">
                  Nuestra historia
                </p>
              </div>
              <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl">
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
                className="group relative inline-flex items-center gap-3 overflow-hidden border border-ink px-7 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ink transition-all duration-300 active:scale-[0.98]"
              >
                <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0" />
                <span className="relative transition-colors duration-300 group-hover:text-panel">
                  Explorar catálogo
                </span>
                <span className="relative transition-all duration-300 group-hover:text-panel group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-px bg-line">
              {[
                { numero: "10+", label: "Años de trayectoria" },
                { numero: "500+", label: "Prendas en catálogo" },
                { numero: "100%", label: "Confección cuidada" },
                { numero: "∞", label: "Estilo atemporal" },
              ].map(({ numero, label }) => (
                <div
                  key={label}
                  className="group relative overflow-hidden bg-panel px-6 py-10 text-center transition-colors duration-300 hover:bg-content/50"
                >
                  <span className="absolute inset-x-0 bottom-0 h-0 bg-ink/5 transition-all duration-500 group-hover:h-full" />
                  <p className="relative text-4xl font-bold tracking-tight text-ink transition-transform duration-300 group-hover:-translate-y-1">
                    {numero}
                  </p>
                  <p className="relative mt-2 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-ink-subtle">
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
