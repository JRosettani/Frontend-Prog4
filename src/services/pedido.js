import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/Pedido");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/Pedido/${id}`);
  return res.data;
};

export const actualizarEstadoPedido = async (id, idEstado) => {
  const res = await base.put(`/Pedido/${id}`, { idEstado });
  return res.data;
};

// services/pedido.js — agregá esto
export const obtenerPorEmail = async (email) => {
  const res = await base.get(`/Pedido/cliente/${email}`);
  return res.data;
};

// ── Usuario logueado ──────────────────────────────────────────────
// items: [{ productoId, talleId, cantidad }]
export const crearPedido = async (items) => {
  const res = await base.post("/Pedido", { items });
  return res.data;
};

export const obtenerMisPedidos = async () => {
  const res = await base.get("/Pedido/mis-pedidos");
  return res.data;
};

export const obtenerMiPedido = async (id) => {
  const res = await base.get(`/Pedido/mis-pedidos/${id}`);
  return res.data;
};

export const cancelarMiPedido = async (id) => {
  const res = await base.delete(`/Pedido/mis-pedidos/${id}`);
  return res.data;
};
