import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Aviso from "./aviso";
import { IconoAlerta } from "./iconos";
import { botonPrimario, campo, panel } from "./estilos";
import { mensajeError } from "../lib/errores";
import { useAuthStore } from "../stores/auth";

// La contraseña es opcional: si se deja vacía no se cambia.
const schema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z
      .string()
      .trim()
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z
      .string()
      .trim()
      .min(1, "Ingresá el correo electrónico")
      .email("El correo electrónico no tiene un formato válido"),
    clave: z
      .string()
      .refine(
        (v) => v === "" || v.length >= 4,
        "La contraseña debe tener al menos 4 caracteres",
      ),
    confirmar: z.string(),
  })
  .refine((d) => d.clave === d.confirmar, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar"],
  });

const campos = [
  { name: "nombre", label: "Nombre", type: "text", autoComplete: "given-name" },
  {
    name: "apellido",
    label: "Apellido",
    type: "text",
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "clave",
    label: "Nueva contraseña (opcional)",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "confirmar",
    label: "Repetir nueva contraseña",
    type: "password",
    autoComplete: "new-password",
  },
];

// Si el usuario editado es el de la sesión, se actualizan sus datos en el
// store para que la navbar y el saludo muestren el nombre nuevo.
export function sincronizarSesion(actualizado) {
  const sesion = useAuthStore.getState().usuario;
  if (!actualizado || !sesion || sesion.id !== actualizado.id) return;
  useAuthStore.setState({
    usuario: {
      ...sesion,
      nombre: actualizado.nombre,
      apellido: actualizado.apellido,
      email: actualizado.email,
    },
  });
}

// Formulario de datos de usuario, compartido por el perfil y por el panel de
// administración. `mutacion` es el resultado de useMutation que envía los datos.
export default function FormUsuario({ usuario, mutacion }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: {
      nombre: usuario.nombre ?? "",
      apellido: usuario.apellido ?? "",
      email: usuario.email ?? "",
      clave: "",
      confirmar: "",
    },
  });

  const onSubmit = ({ nombre, apellido, email, clave }) => {
    const datos = { nombre, apellido, email };
    if (clave) datos.clave = clave;
    mutacion.mutate(datos, {
      // Tras guardar se vacían los campos de contraseña.
      onSuccess: (res) =>
        reset({
          nombre: res?.datos?.nombre ?? nombre,
          apellido: res?.datos?.apellido ?? apellido,
          email: res?.datos?.email ?? email,
          clave: "",
          confirmar: "",
        }),
    });
  };

  return (
    <div className={`${panel} max-w-xl p-6 sm:p-7`}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {campos.map(({ name, label, type, autoComplete }) => (
          <div key={name} className="space-y-1.5">
            <label
              htmlFor={`usuario-${name}`}
              className="block text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              {label}
            </label>
            <input
              type={type}
              id={`usuario-${name}`}
              autoComplete={autoComplete}
              aria-invalid={errors[name] ? "true" : "false"}
              aria-describedby={
                errors[name] ? `usuario-${name}-error` : undefined
              }
              className={campo}
              {...register(name)}
            />
            {errors[name] && (
              <p
                id={`usuario-${name}-error`}
                className="flex items-center gap-1.5 pt-1 text-xs font-medium text-red-500"
              >
                <IconoAlerta className="size-4 shrink-0" />
                {errors[name].message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={mutacion.isPending}
          className={`${botonPrimario} w-full`}
        >
          {mutacion.isPending ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      {mutacion.isError && (
        <div className="mt-5">
          <Aviso tipo="error" titulo="No se pudieron guardar los cambios">
            {mensajeError(mutacion.error, "Intentá de nuevo en unos segundos.")}
          </Aviso>
        </div>
      )}
      {mutacion.isSuccess && (
        <div className="mt-5">
          <Aviso tipo="exito">Los datos se actualizaron correctamente.</Aviso>
        </div>
      )}
    </div>
  );
}
