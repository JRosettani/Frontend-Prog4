import { Link, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerUnoPorId, actualizarUnoPorId } from "../services/usuario";
import FormUsuario, { sincronizarSesion } from "../components/formUsuario";
import Aviso from "../components/aviso";
import { IconoChevron } from "../components/iconos";

// Detalle y edición de un usuario (solo admin).
export default function Usuario() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["usuarios", id],
    queryFn: () => obtenerUnoPorId(id),
  });
  const usuario = data?.datos ?? null;

  const mutacion = useMutation({
    mutationFn: (datos) => actualizarUnoPorId(id, datos),
    onSuccess: (res) => {
      // Si el admin se edita a sí mismo, se refresca también su sesión.
      sincronizarSesion(res?.datos);
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
  });

  return (
    <>
      <Link
        href="/usuarios"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <IconoChevron className="size-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />{" "}
        Volver a usuarios
      </Link>

      {isLoading && (
        <p role="status" className="py-10 text-ink-muted">
          Cargando usuario…
        </p>
      )}

      {isError && (
        <Aviso tipo="error" titulo="No se encontró el usuario">
          Puede que haya sido eliminado o que el id no sea válido.
        </Aviso>
      )}

      {usuario && (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              {usuario.nombre} {usuario.apellido}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Rol:{" "}
              <span className="font-semibold text-ink">
                {(usuario.roles ?? []).map((r) => r.nombre).join(", ") || "—"}
              </span>
            </p>
          </header>
          <FormUsuario usuario={usuario} mutacion={mutacion} />
        </>
      )}
    </>
  );
}
