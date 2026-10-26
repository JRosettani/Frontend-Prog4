import { Link } from "wouter";
import { botonPrimario } from "../components/estilos";

export default function Inicio() {
  return (
    <section className="border-l-4 border-blue py-2 pl-6 sm:py-4 sm:pl-10">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
        Hola, bienvenido
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
        Administra las categorías de tu catálogo: consulta las que ya existen,
        abre el detalle de cada una y crea nuevas cuando las necesites.
      </p>
      <div className="mt-8">
        <Link href="/categorias" className={botonPrimario}>
          Ver categorías
        </Link>
      </div>
    </section>
  );
}
