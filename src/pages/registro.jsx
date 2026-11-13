import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { registrar } from "../services/auth";
import Aviso from "../components/aviso";
import { IconoAlerta } from "../components/iconos";
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
    <div className="mx-auto max-w-sm animate-fadeIn pt-4">
      {/* Cabecera con el logo deformado y estirado horizontalmente */}
      <div className="mb-8 text-center space-y-3">
        <div className="relative mx-auto inline-flex items-center justify-center">
          {/* Pseudoelemento decorativo con deformación y estiramiento horizontal */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-accent/30 scale-x-150 scale-y-90 blur-[1px] transform pointer-events-none"
          />
          <span className="relative grid size-12 place-items-center rounded-2xl bg-accent text-on-accent shadow-lg shadow-accent/20 transition-transform duration-300 hover:scale-105 overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKvFcZ8s1LJ1PECOcJYS1IkqVkwalCRAJUgpc6AA75Zw&s"
              alt="Logo"
              className="size-7 object-contain dark:invert transform scale-x-150 transition-transform duration-300 hover:scale-x-175"
            />
          </span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Crear cuenta
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Completa tus datos para registrarte.
          </p>
        </div>
      </div>

      {/* Tarjeta del formulario */}
      <div
        className={`${panel} p-6 sm:p-7 shadow-xl backdrop-blur-md border border-line/80 relative overflow-hidden`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {campos.map(({ name, label, type, autoComplete }) => (
            <div key={name} className="space-y-1.5">
              <label
                htmlFor={name}
                className="block text-xs font-semibold uppercase tracking-wider text-ink-muted"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                autoComplete={autoComplete}
                aria-invalid={errors[name] ? "true" : "false"}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20`}
                {...register(name)}
              />
              {errors[name] && (
                <p
                  id={`${name}-error`}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 pt-1"
                >
                  <IconoAlerta className="size-4 shrink-0" />
                  {errors[name].message}
                </p>
              )}
            </div>
          ))}

          {/* Botón de envío con indicador de carga */}
          <button
            type="submit"
            disabled={mutationRegistro.isPending}
            className={`${botonPrimario} w-full py-2.5 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {mutationRegistro.isPending ? (
              <>
                <svg
                  className="size-4 animate-spin text-current"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creando cuenta…</span>
              </>
            ) : (
              <span>Registrarme</span>
            )}
          </button>
        </form>

        {mutationRegistro.isError && (
          <div className="mt-5 animate-fadeIn">
            <Aviso tipo="error">
              {mensajeError(
                mutationRegistro.error,
                "No se pudo crear la cuenta. Inténtalo de nuevo.",
              )}
            </Aviso>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-ink-muted border-t border-line/60 pt-4">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-ink underline underline-offset-4 hover:text-primary transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
