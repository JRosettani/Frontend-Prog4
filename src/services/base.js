import axios from "axios";

const base = axios.create({
  baseURL: "http://localhost:5095/api",
});

export default base;
