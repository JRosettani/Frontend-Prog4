import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";
import { useAuthStore } from "../stores/auth";
import Aviso from "../components/aviso";
import { IconoAlerta } from "../components/iconos";
import { botonPrimario, campo, panel } from "../components/estilos";
import { mensajeError } from "../lib/errores";

const usuarioSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo electrónico")
    .email("El correo electrónico no tiene un formato válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export default function Login() {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { email: "", password: "" },
  });

  const { login: iniciarSesion } = useAuthStore();

  const mutationLogin = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => iniciarSesion(data?.datos),
  });

  const onSubmit = (datos) => mutationLogin.mutate(datos);

  return (
    <div className="mx-auto max-w-sm animate-fadeIn pt-4">
      {/* Cabecera */}
      <div className="mb-8 text-center space-y-3">
        <div className="relative mx-auto inline-flex items-center justify-center">
          {/* Pseudoelemento decorativo con deformación y estiramiento horizontal acentuado */}
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
            Iniciar sesión
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Ingresa tus credenciales.
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
          className="space-y-5"
        >
          {/* Campo Correo */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              autoFocus
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${campo} transition-all duration-200 focus:ring-2 focus:ring-primary/20`}
              placeholder="tu@correo.com"
              {...register("email")}
            />
            {errors.email && (
              <p
                id="email-error"
                className="flex items-center gap-1.5 text-xs font-medium text-red-500 pt-1"
              >
                <IconoAlerta className="size-4 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-muted"
              >
                Contraseña
              </label>
            </div>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`${campo} pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20`}
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-xs font-medium focus:outline-none"
                tabIndex={-1}
              >
                {mostrarPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="flex items-center gap-1.5 text-xs font-medium text-red-500 pt-1"
              >
                <IconoAlerta className="size-4 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={mutationLogin.isPending}
            className={`${botonPrimario} w-full py-2.5 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {mutationLogin.isPending ? (
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
                <span>Ingresando…</span>
              </>
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </form>

        {/* Mensaje de error general de la mutación */}
        {mutationLogin.isError && (
          <div className="mt-5 animate-fadeIn">
            <Aviso tipo="error">
              {mensajeError(
                mutationLogin.error,
                "No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.",
              )}
            </Aviso>
          </div>
        )}

        {/* Enlace de registro */}
        <p className="mt-6 text-center text-sm text-ink-muted border-t border-line/60 pt-4">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="font-semibold text-ink underline underline-offset-4 hover:text-primary transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
