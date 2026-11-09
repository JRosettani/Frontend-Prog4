import base from "./base";

export const obtenerTodos = async () => {
  const res = await base.get("/usuarios");
  return res.data;
};

export const obtenerUnoPorId = async (id) => {
  const res = await base.get(`/usuarios/${id}`);
  return res.data;
};

export const obtenerPerfil = async () => {
  const res = await base.get("/usuarios/perfil");
  return res.data;
};

export const actualizarUnoPorId = async (id, usuario) => {
  const res = await base.put(`/usuarios/${id}`, usuario);
  return res.data;
};
