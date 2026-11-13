import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/producto");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/producto/${id}`);
  return res.data;
};

export const crearUno = async (producto) => {
  const res = await base.post("/producto", producto);
  return res.data;
};

export const actualizarUnoPorId = async (id, producto) => {
  const res = await base.put(`/producto/${id}`, producto);
  return res.data;
};
export const eliminarUnoPorId = async (id) => {
  const res = await base.delete(`/producto/${id}`);
  return res.data;
};
