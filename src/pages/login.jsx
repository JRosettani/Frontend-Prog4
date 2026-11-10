import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";
import { useAuthStore } from "../stores/auth";
import Aviso from "../components/aviso";
import { IconoAlerta, IconoEtiqueta } from "../components/iconos";
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
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { email: "", password: "" },
  });

  const { login: iniciarSesion } = useAuthStore();

  // Al guardar la sesión, App detecta isAuthenticated y redirige al inicio.
  const mutationLogin = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => iniciarSesion(data?.datos),
  });

  const onSubmit = (datos) => mutationLogin.mutate(datos);

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-8 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-md bg-accent text-on-accent">
          <IconoEtiqueta className="size-5" />
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-ink-muted">
          Ingresa para administrar el catálogo.
        </p>
      </div>

      <div className={`${panel} p-5`}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-ink-muted"
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
              className={campo}
              {...register("email")}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink"
              >
                <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-ink-muted"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={campo}
              {...register("password")}
            />
            {errors.password && (
              <p
                id="password-error"
                className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink"
              >
                <IconoAlerta className="mt-0.5 size-4 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutationLogin.isPending}
            className={`${botonPrimario} w-full`}
          >
            {mutationLogin.isPending ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        {mutationLogin.isError && (
          <div className="mt-4">
            <Aviso tipo="error">
              {mensajeError(
                mutationLogin.error,
                "No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.",
              )}
            </Aviso>
          </div>
        )}
      </div>
    </div>
  );
}
