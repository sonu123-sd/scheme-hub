import api from "../utils/api";

export interface AuthResponse {
  message: string;
  token: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return res.data;
};
