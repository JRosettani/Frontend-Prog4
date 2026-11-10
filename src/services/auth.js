import base from "./base";

export const login = async (usuario) => {
  const res = await base.post("/Auth/login", usuario);
  return res.data;
};
