import api from "@/services/api";

export const roleService = {
  getRoleApi: async (params?: {
    page: number;
    limit: number;
    sortBy: string;
    order: string;
  }) => {
    const res = await api.get("/role", { params });
    return res.data.data;
  },
  getAllRoleApi: async () => {
    const res = await api.get("/role/all");
    return res.data.data;
  },
  createRoleApi: async (data: { name: string }) => {
    const res = await api.post("/role", data);
    return res.data.data;
  },
  editRoleApi: async (roleId: string, data: { name: string }) => {
    const res = await api.put(`/role/${roleId}`, data);
    return res.data.data;
  },
  deleteRoleApi: async (roleId: string) => {
    const res = await api.delete(`/role/${roleId}`);
    return res.data.data;
  },
};