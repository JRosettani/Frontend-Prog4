import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/productotalle");
  return res.data;
};

export const obtenerUnoPorId = async (productoId, talleId) => {
  const res = await base.get(`/productotalle/${productoId}/${talleId}`);
  return res.data;
};

export const crearUno = async (productoTalle) => {
  const res = await base.post("/productotalle", productoTalle);
  return res.data;
};

export const actualizarUno = async (productoTalle) => {
  const res = await base.put("/productotalle", productoTalle);
  return res.data;
};

export const eliminarUnoPorId = async (productoId, talleId) => {
  const res = await base.delete(`/productotalle/${productoId}/${talleId}`);
  return res.data;
};
