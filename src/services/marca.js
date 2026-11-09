import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/marca");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/marca/${id}`);
  return res.data;
};

export const crearUno = async (marca) => {
  const res = await base.post("/marca", marca);
  return res.data;
};

export const actualizarUnoPorId = async (id, marca) => {
  const res = await base.put(`/marca/${id}`, marca);
  return res.data;
};

export const eliminarUnoPorId = async (id) => {
  const res = await base.delete(`/marca/${id}`);
  return res.data;
};
