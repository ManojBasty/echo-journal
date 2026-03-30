import api from "./axios";

export const signupUser = async (email: string, password: string) => {
  const response = await api.post("api/auth/signup", {
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};