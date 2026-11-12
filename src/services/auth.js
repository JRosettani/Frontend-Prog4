import base from "./base";

export const login = async (usuario) => {
  const res = await base.post("/Auth/login", usuario);
  return res.data;
};

export const registrar = async (usuario) => {
  const res = await base.post("/Auth/register", usuario);
  return res.data;
};
