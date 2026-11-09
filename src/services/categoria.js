import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/categorias");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/categorias/${id}`);
  return res.data;
};

export const crearUno = async (cat) => {
  const res = await base.post("/categorias", cat);
  return res.data;
};

export const actualizarUnoPorId = async (id, cat) => {
  const res = await base.put(`/categorias/${id}`, cat);
  return res.data;
};

export const eliminarUnoPorId = async (id) => {
  const res = await base.delete(`/categorias/${id}`);
  return res.data;
};
