import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerPerfil, actualizarUnoPorId } from "../services/usuario";
import { useAuthStore } from "../stores/auth";
import PaginaUsuario, { EncabezadoUsuario } from "../components/paginaUsuario";
import FormUsuario, { sincronizarSesion } from "../components/formUsuario";
import Aviso from "../components/aviso";
import { IconoReintentar } from "../components/iconos";
import { botonSecundario } from "../components/estilos";

// Perfil del usuario logueado (sirve tanto para usuarios como para admins).
export default function Perfil() {
  const esAdmin = useAuthStore((s) => s.esAdmin)();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["perfil"],
    queryFn: obtenerPerfil,
  });
  const perfil = data?.datos ?? null;

  const mutacion = useMutation({
    mutationFn: (datos) => actualizarUnoPorId(perfil.id, datos),
    onSuccess: (res) => {
      sincronizarSesion(res?.datos);
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  const contenido = (
    <>
      <EncabezadoUsuario etiqueta="Tu cuenta" titulo="Mi perfil">
        Actualizá tus datos personales o cambiá tu contraseña.
      </EncabezadoUsuario>

      {isLoading && (
        <p role="status" className="py-10 text-ink-muted">
          Cargando perfil…
        </p>
      )}

      {isError && (
        <Aviso
          tipo="error"
          titulo="No se pudo cargar tu perfil"
          accion={
            <button
              type="button"
              onClick={() => refetch()}
              className={botonSecundario}
            >
              <IconoReintentar className="size-4" /> Reintentar
            </button>
          }
        >
          Comprobá tu conexión con el servidor e intentá de nuevo.
        </Aviso>
      )}

      {perfil && (
        <>
          <p className="mb-6 text-sm text-ink-muted">
            Rol:{" "}
            <span className="font-semibold text-ink">
              {(perfil.roles ?? []).map((r) => r.nombre).join(", ") || "—"}
            </span>
          </p>
          <FormUsuario usuario={perfil} mutacion={mutacion} />
        </>
      )}
    </>
  );

  // El panel de admin ya trae su propio contenedor; el del usuario no.
  return esAdmin ? contenido : <PaginaUsuario>{contenido}</PaginaUsuario>;
}
