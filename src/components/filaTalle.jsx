import { Controller } from "react-hook-form";
import { IconoPapelera } from "./iconos";
import { botonIcono, campo } from "./estilos";

// Fila "talle + stock" del formulario de productos (alta y edicion).
//
// El selector es controlado (Controller) y no un <select> no controlado:
// asi, aunque la lista de talles llegue DESPUES de que el formulario se
// precargo, el talle elegido se sigue mostrando. Ademas:
//  - las opciones tienen fondo/color explicitos (se ven en modo claro y oscuro)
//  - un talle ya usado en otra fila aparece deshabilitado (evita duplicados)
//  - si el talle guardado todavia no esta en la lista, se muestra igual con
//    su nombre de respaldo.
export default function FilaTalle({
  index,
  control,
  register,
  talles,
  usados,
  respaldo = {},
  puedeQuitar,
  onQuitar,
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_6rem_2.25rem] items-center gap-2">
      <Controller
        control={control}
        name={`talles.${index}.talleId`}
        render={({ field }) => {
          const valor = field.value == null ? "" : String(field.value);
          const enLista = talles.some((t) => String(t.id) === valor);
          return (
            <select
              ref={field.ref}
              name={field.name}
              value={valor}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              aria-label={`Talle ${index + 1}`}
              className={`${campo} cursor-pointer`}
            >
              <option value="" className="bg-panel text-ink">
                Elegí un talle
              </option>
              {valor && !enLista && (
                <option value={valor} className="bg-panel text-ink">
                  {respaldo[valor] ?? `Talle ${valor}`}
                </option>
              )}
              {talles.map((t) => {
                const ocupado =
                  usados.has(String(t.id)) && String(t.id) !== valor;
                return (
                  <option
                    key={t.id}
                    value={String(t.id)}
                    disabled={ocupado}
                    className="bg-panel text-ink"
                  >
                    {t.nombre}
                    {ocupado ? " (ya agregado)" : ""}
                  </option>
                );
              })}
            </select>
          );
        }}
      />
      <input
        type="number"
        min="0"
        placeholder="Stock"
        aria-label={`Stock talle ${index + 1}`}
        className={campo}
        {...register(`talles.${index}.stock`)}
      />
      {puedeQuitar ? (
        <button
          type="button"
          onClick={onQuitar}
          aria-label="Quitar talle"
          className={`${botonIcono} text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40`}
        >
          <IconoPapelera className="size-4" />
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}
