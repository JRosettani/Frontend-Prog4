import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/EstadoPedido");
  return res.data;
};
