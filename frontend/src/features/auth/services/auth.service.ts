import api from "@/services/api";
import { AuthUser } from "@/stores/authStore";
import { loginInput } from "../validation/auth.validate";

export const authService = {
  loginApi: async (data: loginInput): Promise<AuthUser> => {
    const response = await api.post("/auth/login", data);
    return response.data.data;
  },

  meApi: async (): Promise<AuthUser> => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },

  logoutApi: () => api.post("/auth/logout"),

  register: async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  },
};
