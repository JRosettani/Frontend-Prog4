import base from "./base";

export const login = async (usuario) => {
  const res = await base.post("/Auth/login", usuario);
  console.log(res);
  return res.data;
};
