import axios from "axios";

const base = axios.create({
  baseURL: "http://localhost:5095/api",
});

export const obtenerTodos = async () => {
  const res = await base.get("/categorias");
  return res.data;
};

export const crearUno = async (cat) => {
  const res = await base.post("/categorias", cat);
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/categorias/${id}`);
  return res.data;
};
