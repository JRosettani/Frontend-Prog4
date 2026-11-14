import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";

// Carrito del usuario. Cada línea es una variante (producto + talle).
// Se guarda el nombre, el precio y el stock para poder mostrar el carrito
// sin volver a pedir los productos; el backend igualmente revalida stock y
// precio al crear el pedido.
const handler = (set, get) => ({
  items: [],

  // Suma cantidad a una variante, sin pasar del stock disponible.
  agregar: ({ cantidad = 1, ...item }) =>
    set((estado) => {
      const existente = estado.items.find(
        (i) => i.productoId === item.productoId && i.talleId === item.talleId,
      );
      if (existente) {
        return {
          items: estado.items.map((i) =>
            i === existente
              ? {
                  ...i,
                  ...item, // refresca precio, stock e imagen
                  cantidad: Math.min(i.cantidad + cantidad, item.stock),
                }
              : i,
          ),
        };
      }
      return {
        items: [
          ...estado.items,
          { ...item, cantidad: Math.min(cantidad, item.stock) },
        ],
      };
    }),

  cambiarCantidad: (productoId, talleId, cantidad) =>
    set((estado) => ({
      items: estado.items.map((i) =>
        i.productoId === productoId && i.talleId === talleId
          ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
          : i,
      ),
    })),

  quitar: (productoId, talleId) =>
    set((estado) => ({
      items: estado.items.filter(
        (i) => !(i.productoId === productoId && i.talleId === talleId),
      ),
    })),

  vaciar: () => set({ items: [] }),

  cantidadTotal: () => get().items.reduce((suma, i) => suma + i.cantidad, 0),
  precioTotal: () =>
    get().items.reduce((suma, i) => suma + i.precio * i.cantidad, 0),
});

export const useCarritoStore = create(
  persist(handler, { name: "carrito-store" }),
);

// Al cerrar sesión (manual o por token vencido) se vacía el carrito, para que
// no lo herede otra persona que use el mismo navegador.
useAuthStore.subscribe((estado, anterior) => {
  if (anterior.isAuthenticated && !estado.isAuthenticated) {
    useCarritoStore.getState().vaciar();
  }
});
