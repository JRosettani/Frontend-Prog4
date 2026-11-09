import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/talle");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/talle/${id}`);
  return res.data;
};

export const crearUno = async (talle) => {
  const res = await base.post("/talle", talle);
  return res.data;
};

export const actualizarUnoPorId = async (id, talle) => {
  const res = await base.put(`/talle/${id}`, talle);
  return res.data;
};

export const eliminarUnoPorId = async (id) => {
  const res = await base.delete(`/talle/${id}`);
  return res.data;
};
