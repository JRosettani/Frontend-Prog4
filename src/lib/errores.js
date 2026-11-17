// Devuelve el mensaje de error a mostrar al usuario.
// Prioriza el mensaje que manda el backend ({ mensaje, datos }) y, si no hay
// respuesta (servidor caído, sin conexión), usa el texto por defecto.
export function mensajeError(error, porDefecto) {
  const data = error?.response?.data;

  if (typeof data?.mensaje === "string" && data.mensaje) return data.mensaje;

  // Errores de validación automáticos de ASP.NET: { errors: { Campo: ["..."] } }
  if (data?.errors && typeof data.errors === "object") {
    const primero = Object.values(data.errors).flat()[0];
    if (typeof primero === "string" && primero) return primero;
  }

  return porDefecto;
}
