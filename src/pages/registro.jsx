import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { registrar } from "../services/auth";
import Aviso from "../components/aviso";
import { IconoAlerta, IconoEtiqueta } from "../components/iconos";
import { botonPrimario, campo, panel } from "../components/estilos";
import { mensajeError } from "../lib/errores";

const registroSchema = z
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
      .min(1, "Ingresa tu correo electrónico")
      .email("El correo electrónico no tiene un formato válido"),
    clave: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
    confirmar: z.string().min(1, "Repite tu contraseña"),
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
    label: "Contraseña",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "confirmar",
    label: "Repetir contraseña",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function Registro() {
  const [, navigate] = useLocation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      confirmar: "",
    },
  });

  const mutationRegistro = useMutation({
    mutationKey: ["registro"],
    mutationFn: registrar,
    // El backend no devuelve token: después de registrarse hay que iniciar sesión.
    onSuccess: () => navigate("/login", { replace: true }),
  });

  const onSubmit = ({ nombre, apellido, email, clave }) =>
    mutationRegistro.mutate({ nombre, apellido, email, clave, roles: [] });

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-8 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-md bg-accent text-on-accent">
          <IconoEtiqueta className="size-5" />
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Crear cuenta
        </h1>
        <p className="mt-2 text-ink-muted">
          Completa tus datos para registrarte.
        </p>
      </div>

      <div className={`${panel} p-5`}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {campos.map(({ name, label, type, autoComplete }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                autoComplete={autoComplete}
                aria-invalid={errors[name] ? "true" : "false"}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                className={campo}
                {...register(name)}
              />
              {errors[name] && (
                <p
                  id={`${name}-error`}
                  className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink"
                >
                  <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                  {errors[name].message}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={mutationRegistro.isPending}
            className={`${botonPrimario} w-full`}
          >
            {mutationRegistro.isPending ? "Creando cuenta…" : "Registrarme"}
          </button>
        </form>

        {mutationRegistro.isError && (
          <div className="mt-4">
            <Aviso tipo="error">
              {mensajeError(
                mutationRegistro.error,
                "No se pudo crear la cuenta. Inténtalo de nuevo.",
              )}
            </Aviso>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-ink-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
