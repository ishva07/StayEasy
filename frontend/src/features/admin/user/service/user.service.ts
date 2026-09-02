import api from "@/services/api";

export const userService = {
  getUserApi: async (params?: {
    page: number;
    limit: number;
    sortBy: string;
    order: string;
  }) => {
    const res = await api.get("/user", { params });
    return res.data.data;
  },
  changeUserRoleApi: async (userId: string, roleId: string) => {
    const res = await api.put(`/user/${userId}/role`, { roleId });
    return res.data.data;
  },
};