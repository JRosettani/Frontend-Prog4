import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/pedidoitem");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/pedidoitem/${id}`);
  return res.data;
};

export const crearUno = async (item) => {
  const res = await base.post("/pedidoitem", item);
  return res.data;
};

export const actualizarUnoPorId = async (id, item) => {
  const res = await base.put(`/pedidoitem/${id}`, item);
  return res.data;
};

export const eliminarUnoPorId = async (id) => {
  const res = await base.delete(`/pedidoitem/${id}`);
  return res.data;
};
