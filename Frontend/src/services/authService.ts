import api from "../utils/api";

export interface AuthResponse {
  message: string;
  token: string;
}

export const loginUser = async (
  identifier: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", {
    identifier,
    password,
  });

  return res.data;
};
